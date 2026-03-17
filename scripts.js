(function () {
    'use strict';

    // --- Constants (from config.js) ---
    var FLIP_ORIENTATION = CONFIG.FLIP_ORIENTATION;
    var ERROR_DURATION = CONFIG.ERROR_DURATION;
    var IDLE_TIMEOUT = CONFIG.IDLE_TIMEOUT;
    var STRATAGEM_DURATION = CONFIG.STRATAGEM_DURATION;

    // --- Boot sequence (weight = relative display time) ---
    var BOOT_LINES = [
        { text: '', weight: 0 },
        { text: 'Memory test: 512MB SuperRAM DDR5 ......... OK', weight: 12 },
        { text: 'NAND: 4GB PatriotFlash ................... OK', weight: 2 },
        { text: 'Secure boot chain ........................ VERIFIED', weight: 3 },
        { text: '', weight: 0 },
        { text: '', weight: 0 },
        { text: '', weight: 0 },
        { text: '', weight: 2 },
        { text: 'Loading DemocracyKernel v6.14-LIBERTY .... OK', weight: 16 },
        { text: '  kernel 1.8MB decompressed, /dev/liberty mounted', weight: 2 },
        { text: 'Initializing hardware ..... OK', weight: 4 },
        { text: '  touch ok, display ok, audio ok, haptics ok', weight: 1 },
        { text: 'AES-512-FREEDOM encryption ............... ACTIVE', weight: 4 },
        { text: 'IFF transponder broadcasting', weight: 1 },
        { text: 'Biometric lock BYPASSED (field mode)', weight: 1 },
        { text: '[WARN] Operating without biometric auth', weight: 3 },
        { text: '', weight: 1 },
        { text: 'Establishing orbital uplink .............. CONNECTED', weight: 14 },
        { text: '  447.200 MHz / -42 dBm / SES "' + CONFIG.SHIP_NAME + '"', weight: 3 },
        { text: 'Eagle 1 CAS datalink ..................... SYNCED', weight: 3 },
        { text: 'Mounting /dev/stratagem .................. OK', weight: 10 },
        { text: '  82 stratagems loaded, targeting nominal', weight: 3 },
        { text: '  hellbomb safety interlock armed', weight: 1 },
        { text: 'Threat assessment ....................... DONE', weight: 4 },
        { text: '  Terminid WATCH / Automaton STANDBY / Illuminate LISTENING', weight: 1 },
        { text: '[WARN] Firmware update available (v4.2.2-hotfix)', weight: 2 },
        { text: '', weight: 0 },
        { text: '', weight: 0 },
        { text: '', weight: 1 },
        { text: 'Operator: ' + CONFIG.HELLDIVER_NAME, weight: 1 },
        { text: 'Vessel:   SES ' + CONFIG.SHIP_NAME, weight: 2 },
        { text: '', weight: 1 },
        { text: 'System ready. Launching interface...', weight: 15 },
    ];

    var BOOT_DURATION = CONFIG.BOOT_DURATION;
    var totalWeight = BOOT_LINES.reduce(function (sum, l) { return sum + l.weight; }, 0);

    var bootScreen = document.getElementById('boot-screen');
    var bootLog = document.getElementById('boot-log');
    var bootScrollEl = bootLog;
    var welcomeScreen = document.getElementById('welcome-screen');
    var appScreen = document.getElementById('app');

    // Splits: "  Text here .............. STATUS" → [label, dots, status]
    var statusPattern = /^(.*?)\s*(\.{2,})\s+(\S.*)$/;

    function scrollBoot() {
        var firstLine = bootLog.querySelector('div');
        if (!firstLine) return;
        var lh = firstLine.offsetHeight;
        if (lh <= 0) return;
        // Show only full lines: calculate how many fit, scroll so bottom content is visible
        var visibleLines = Math.floor(bootScrollEl.clientHeight / lh);
        var targetScroll = bootScrollEl.scrollHeight - (visibleLines * lh);
        bootScrollEl.scrollTop = Math.max(0, targetScroll);
    }

    function runBootSequence() {
        var i = 0;

        function addLine() {
            if (i >= BOOT_LINES.length) {
                setTimeout(showWelcome, 100);
                return;
            }
            var entry = BOOT_LINES[i];
            var line = entry.text;
            var span = document.createElement('div');
            var match = statusPattern.exec(line);
            var delay = (entry.weight / totalWeight) * BOOT_DURATION;

            if (line.indexOf('[WARN]') === 0) {
                span.classList.add('boot-warn');
                span.textContent = line;
            } else if (line.indexOf('[FAIL]') === 0) {
                span.classList.add('boot-fail');
                span.textContent = line;
            } else if (line === '') {
                span.textContent = ' ';
            } else if (match) {
                if (line.charAt(0) !== ' ') span.classList.add('boot-heading');
                var label = match[1] + ' ';
                var totalDots = match[2].length;
                var status = ' ' + match[3];
                var dotCount = 0;
                var dotInterval = delay / totalDots;

                span.textContent = label;
                bootLog.appendChild(span);
                scrollBoot();
                i++;

                var dotTimer = setInterval(function () {
                    dotCount++;
                    span.textContent = label + '.'.repeat(dotCount);
                    if (dotCount >= totalDots) {
                        clearInterval(dotTimer);
                        span.textContent = label + '.'.repeat(totalDots) + status;
                        scrollBoot();
                        setTimeout(addLine, 0);
                    }
                }, dotInterval);
                return;
            } else if (line.length > 0 && line.charAt(0) !== ' ') {
                span.classList.add('boot-heading');
                span.textContent = line;
            } else {
                span.textContent = line;
            }

            bootLog.appendChild(span);
            scrollBoot();
            i++;
            setTimeout(addLine, delay);
        }

        addLine();
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- Screen transitions ---

    function showWelcome() {
        bootScreen.classList.add('hidden');
        appScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        stopIdleTimer();

        function onDismiss(e) {
            e.preventDefault();
            welcomeScreen.removeEventListener('click', onDismiss);
            welcomeScreen.removeEventListener('touchstart', onDismiss);
            document.removeEventListener('keydown', onKey);
            showApp();
        }
        function onKey(e) {
            onDismiss(e);
        }
        welcomeScreen.addEventListener('click', onDismiss);
        welcomeScreen.addEventListener('touchstart', onDismiss);
        document.addEventListener('keydown', onKey);
    }

    var audioInitialized = false;

    function showApp() {
        welcomeScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
        if (!audioInitialized) {
            initAudio();
            audioInitialized = true;
        }
        resetInput();
        resetIdleTimer();
    }

    // --- Idle timer (screensaver) ---
    var idleTimer = null;

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(showWelcome, IDLE_TIMEOUT);
    }

    function stopIdleTimer() {
        clearTimeout(idleTimer);
    }

    // --- Stratagem sound pools (randomly picked per category) ---
    var EAGLE_SOUNDS = [
        'sounds/stratagems/eagle-administering-freedom.mp3',
        'sounds/stratagems/eagle-attack-underway.mp3',
        'sounds/stratagems/eagle-coming-in-hot.mp3',
        'sounds/stratagems/eagle-democracy-on-its-way.mp3',
        'sounds/stratagems/eagle-eat-liberty.mp3',
        'sounds/stratagems/eagle-here-comes-cavalry.mp3',
        'sounds/stratagems/eagle-unleashing-democracy.mp3',
        'sounds/stratagems/eagle-super-earths-finest.mp3',
    ];

    var SENTRY_SOUNDS = [
        'sounds/stratagems/destroyer-sending-sentry.mp3',
    ];

    var WEAPON_SOUNDS = [
        'sounds/stratagems/destroyer-deploying-support-weapon.mp3',
        'sounds/stratagems/destroyer-sending-support-weapon.mp3',
    ];

    var BACKPACK_SOUNDS = [
        'sounds/stratagems/destroyer-deploying-equipment.mp3',
        'sounds/stratagems/destroyer-deploying-equipment-2.mp3',
    ];

    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // --- Stratagems ---
    var STRATAGEMS = [
        // Backpacks
        { name: "LIFT-850 Jump Pack", logo: "images/lift_850_jump_pack.svg", sequence: ["down", "up", "up", "down", "up"], sounds: BACKPACK_SOUNDS },
        { name: "B-1 Supply Pack", logo: "images/b_1_supply_pack.svg", sequence: ["down", "left", "down", "up", "up", "down"], sounds: BACKPACK_SOUNDS },
        { name: "AX/LAS-5 'Guard Dog' Rover", logo: "images/ax_las_5_guard_dog_rover.svg", sequence: ["down", "up", "left", "up", "right", "right"], sounds: BACKPACK_SOUNDS },
        { name: "SH-20 Ballistic Shield Backpack", logo: "images/sh_20_ballistic_shield_backpack.svg", sequence: ["down", "left", "down", "down", "up", "left"], sounds: BACKPACK_SOUNDS },
        { name: "SH-32 Shield Generator Pack", logo: "images/sh_32_shield_generator_pack.svg", sequence: ["down", "up", "left", "right", "left", "right"], sounds: BACKPACK_SOUNDS },
        { name: "AX/AR-23 'Guard Dog'", logo: "images/ax_ar_23_guard_dog.svg", sequence: ["down", "up", "left", "up", "right", "down"], sounds: BACKPACK_SOUNDS },
        // Support weapons
        { name: "MG-43 Machine Gun", logo: "images/mg_43_machine_gun.svg", sequence: ["down", "left", "down", "up", "right"], sounds: WEAPON_SOUNDS },
        { name: "APW-1 Anti-Materiel Rifle", logo: "images/apw_1_anti_materiel_rifle.svg", sequence: ["down", "left", "right", "up", "down"], sounds: WEAPON_SOUNDS },
        { name: "M-105 Stalwart", logo: "images/m_105_stalwart.svg", sequence: ["down", "left", "down", "up", "up", "left"], sounds: WEAPON_SOUNDS },
        { name: "EAT-17 Expendable Anti-tank", logo: "images/eat_17_expendable_anti_tank.svg", sequence: ["down", "down", "left", "up", "right"], sounds: WEAPON_SOUNDS },
        { name: "GR-8 Recoilless Rifle", logo: "images/gr_8_recoilless_rifle.svg", sequence: ["down", "left", "right", "right", "left"], sounds: WEAPON_SOUNDS },
        { name: "FLAM-40 Flamethrower", logo: "images/flam_40_flamethrower.svg", sequence: ["down", "left", "up", "down", "up"], sounds: WEAPON_SOUNDS },
        { name: "AC-8 Autocannon", logo: "images/ac_8_autocannon.svg", sequence: ["down", "left", "down", "up", "up", "right"], sounds: WEAPON_SOUNDS },
        { name: "MG-206 Heavy Machine Gun", logo: "images/mg_206_heavy_machine_gun.svg", sequence: ["down", "left", "up", "down", "down"], sounds: WEAPON_SOUNDS },
        { name: "RS-422 Railgun", logo: "images/rs_422_railgun.svg", sequence: ["down", "right", "down", "up", "left", "right"], sounds: WEAPON_SOUNDS },
        { name: "FAF-14 SPEAR Launcher", logo: "images/faf_14_spear_launcher.svg", sequence: ["down", "down", "up", "down", "down"], sounds: WEAPON_SOUNDS },
        { name: "GL-21 Grenade Launcher", logo: "images/gl_21_grenade_launcher.svg", sequence: ["down", "left", "up", "left", "down"], sounds: WEAPON_SOUNDS },
        { name: "LAS-98 Laser Cannon", logo: "images/las_98_laser_cannon.svg", sequence: ["down", "left", "down", "up", "left"], sounds: WEAPON_SOUNDS },
        { name: "ARC-3 Arc Thrower", logo: "images/arc_3_arc_thrower.svg", sequence: ["down", "right", "down", "up", "left", "left"], sounds: WEAPON_SOUNDS },
        { name: "LAS-99 Quasar Cannon", logo: "images/las_99_quasar_cannon.svg", sequence: ["down", "down", "up", "left", "right"], sounds: WEAPON_SOUNDS },
        { name: "RL-77 Airburst Rocket Launcher", logo: "images/rl_77_airburst_rocket_launcher.svg", sequence: ["down", "up", "up", "left", "right"], sounds: WEAPON_SOUNDS },
        { name: "MLS-4X Commando", logo: "images/mls_4x_commando.svg", sequence: ["down", "left", "up", "down", "right"], sounds: WEAPON_SOUNDS },
        { name: "StA-X3 W.A.S.P. Launcher", logo: "images/sta_x3_wasp_launcher.svg", sequence: ["down", "down", "up", "down", "right"], sounds: WEAPON_SOUNDS },
        { name: "PLAS-45 Epoch", logo: "images/plas_45_epoch.svg", sequence: ["down", "left", "up", "left", "right"], sounds: WEAPON_SOUNDS },
        { name: "CQC-20 Breaching Hammer", logo: "images/cqc_20_breaching_hammer.svg", sequence: ["down", "left", "right", "left", "up"], sounds: WEAPON_SOUNDS },
        { name: "S-11 Speargun", logo: "images/s_11_speargun.svg", sequence: ["down", "right", "down", "left", "up", "right"], sounds: WEAPON_SOUNDS },
        { name: "EAT-700 Expendable Napalm", logo: "images/eat_700_expendable_napalm.svg", sequence: ["down", "down", "left", "up", "left"], sounds: WEAPON_SOUNDS },
        { name: "TX-41 Sterilizer", logo: "images/tx_41_sterilizer.svg", sequence: ["down", "left", "up", "down", "left"], sounds: WEAPON_SOUNDS },
        { name: "CQC-9 Defoliation Tool", logo: "images/cqc_9_defoliation_tool.svg", sequence: ["down", "left", "right", "right", "down"], sounds: WEAPON_SOUNDS },
        { name: "GL-52 De-Escalator", logo: "images/gl_52_de_escalator.svg", sequence: ["down", "right", "up", "left", "right"], sounds: WEAPON_SOUNDS },
        { name: "EAT-411 Leveller", logo: "images/eat_411_leveller.svg", sequence: ["down", "down", "left", "up", "down"], sounds: WEAPON_SOUNDS },
        { name: "B/MD C4 Pack", logo: "images/b_md_c4_pack.svg", sequence: ["down", "right", "up", "up", "right", "up"], sounds: BACKPACK_SOUNDS },
        { name: "MS-11 Solo Silo", logo: "images/ms_11_solo_silo.svg", sequence: ["down", "up", "right", "down", "down"], sounds: WEAPON_SOUNDS },
        { name: "GL-28 Belt-Fed Grenade Launcher", logo: "images/gl_28_belt_fed_grenade_launcher.svg", sequence: ["down", "left", "up", "left", "up", "up"], sounds: WEAPON_SOUNDS },
        { name: "M-1000 Maxigun", logo: "images/m_1000_maxigun.svg", sequence: ["down", "left", "right", "down", "up", "up"], sounds: WEAPON_SOUNDS },
        { name: "CQC-1 One True Flag", logo: "images/cqc_1_one_true_flag.svg", sequence: ["down", "left", "right", "right", "up"], sounds: WEAPON_SOUNDS },
        // Emplacements
        { name: "E/MG-101 HMG Emplacement", logo: "images/e_mg_101_hmg_emplacement.svg", sequence: ["down", "up", "left", "right", "right", "left"], sounds: ['sounds/stratagems/destroyer-deploying-emplacement.mp3'] },
        { name: "FX-12 Shield Generator Relay", logo: "images/fx_12_shield_generator_relay.svg", sequence: ["down", "down", "left", "right", "left", "right"], sounds: BACKPACK_SOUNDS },
        { name: "A/ARC-3 Tesla Tower", logo: "images/a_arc_3_tesla_tower.svg", sequence: ["down", "up", "right", "up", "left", "right"], sounds: SENTRY_SOUNDS },
        // Mines
        { name: "MD-6 Anti-Personnel Minefield", logo: "images/md_6_anti_personnel_minefield.svg", sequence: ["down", "left", "up", "right"], sounds: ['sounds/stratagems/destroyer-deploying-minefield.mp3'] },
        { name: "MD-14 Incendiary Mines", logo: "images/md_14_incendiary_mines.svg", sequence: ["down", "left", "left", "down"], sounds: ['sounds/stratagems/destroyer-deploying-minefield.mp3'] },
        { name: "MD-17 Anti-Tank Mines", logo: "images/md_17_anti_tank_mines.svg", sequence: ["down", "left", "up", "up"], sounds: ['sounds/stratagems/destroyer-deploying-minefield.mp3'] },
        { name: "MD-8 Gas Mines", logo: "images/md_8_gas_mines.svg", sequence: ["down", "left", "left", "right"], sounds: ['sounds/stratagems/destroyer-deploying-minefield.mp3'] },
        // More emplacements
        { name: "E/GL-21 Grenadier Battlement", logo: "images/e_gl_21_grenadier_battlement.svg", sequence: ["down", "right", "down", "left", "right"], sounds: ['sounds/stratagems/destroyer-deploying-emplacement.mp3'] },
        { name: "E/AT-12 Anti-Tank Emplacement", logo: "images/e_at_12_anti_tank_emplacement.svg", sequence: ["down", "up", "left", "right", "right", "right"], sounds: ['sounds/stratagems/destroyer-deploying-emplacement.mp3'] },
        // Sentries
        { name: "A/MG-43 Machine Gun Sentry", logo: "images/a_mg_43_machine_gun_sentry.svg", sequence: ["down", "up", "right", "right", "up"], sounds: SENTRY_SOUNDS },
        { name: "A/G-16 Gatling Sentry", logo: "images/a_g_16_gatling_sentry.svg", sequence: ["down", "up", "right", "left"], sounds: SENTRY_SOUNDS },
        { name: "A/M-12 Mortar Sentry", logo: "images/a_m_12_mortar_sentry.svg", sequence: ["down", "up", "right", "right", "down"], sounds: SENTRY_SOUNDS },
        { name: "A/AC-8 Autocannon Sentry", logo: "images/a_ac_8_autocannon_sentry.svg", sequence: ["down", "up", "right", "up", "left", "up"], sounds: SENTRY_SOUNDS },
        { name: "A/MLS-4X Rocket Sentry", logo: "images/a_mls_4x_rocket_sentry.svg", sequence: ["down", "up", "right", "right", "left"], sounds: SENTRY_SOUNDS },
        { name: "A/M-23 EMS Mortar Sentry", logo: "images/a_m_23_ems_mortar_sentry.svg", sequence: ["down", "up", "right", "down", "right"], sounds: SENTRY_SOUNDS },
        { name: "A/LAS-98 Laser Sentry", logo: "images/a_las_98_laser_sentry.svg", sequence: ["down", "up", "right", "down", "up", "right"], sounds: SENTRY_SOUNDS },
        { name: "A/FLAM-40 Flame Sentry", logo: "images/a_flam_40_flame_sentry.svg", sequence: ["down", "up", "right", "down", "up", "up"], sounds: SENTRY_SOUNDS },
        // Orbital
        { name: "Orbital Gatling Barrage", logo: "images/orbital_gatling_barrage.svg", sequence: ["right", "down", "left", "up", "up"], sounds: ['sounds/stratagems/destroyer-firing-orbital-barrage.mp3'] },
        { name: "Orbital Airburst Strike", logo: "images/orbital_airburst_strike.svg", sequence: ["right", "right", "right"], sounds: ['sounds/stratagems/destroyer-firing-orbital-strike.mp3'] },
        { name: "Orbital 120MM HE Barrage", logo: "images/orbital_120mm_he_barrage.svg", sequence: ["right", "right", "down", "left", "right", "down"], sounds: ['sounds/stratagems/destroyer-orbital-barrage-incoming.mp3'] },
        { name: "Orbital 380MM HE Barrage", logo: "images/orbital_380mm_he_barrage.svg", sequence: ["right", "down", "up", "up", "left", "down", "down"], sounds: ['sounds/stratagems/destroyer-firing-orbital-barrage.mp3'] },
        { name: "Orbital Walking Barrage", logo: "images/orbital_walking_barrage.svg", sequence: ["right", "down", "right", "down", "right", "down"], sounds: ['sounds/stratagems/destroyer-orbital-barrage-incoming.mp3'] },
        { name: "Orbital Laser", logo: "images/orbital_laser.svg", sequence: ["right", "down", "up", "right", "down"], sounds: ['sounds/stratagems/destroyer-engaging-orbital-laser.mp3'] },
        { name: "Orbital Napalm Barrage", logo: "images/orbital_napalm_barrage.svg", sequence: ["right", "right", "down", "left", "right", "up"], sounds: ['sounds/stratagems/destroyer-firing-orbital-barrage.mp3'] },
        { name: "Orbital Railcannon Strike", logo: "images/orbital_railcannon_strike.svg", sequence: ["right", "up", "down", "down", "right"], sounds: ['sounds/stratagems/destroyer-orbital-strike-incoming.mp3'] },
        { name: "Orbital Precision Strike", logo: "images/orbital_precision_strike.svg", sequence: ["right", "right", "up"], sounds: ['sounds/stratagems/destroyer-firing-orbital-strike.mp3'] },
        { name: "Orbital Gas Strike", logo: "images/orbital_gas_strike.svg", sequence: ["right", "right", "down", "right"], sounds: ['sounds/stratagems/destroyer-firing-gas-strike.mp3', 'sounds/stratagems/destroyer-gas-strike-incoming.mp3'] },
        { name: "Orbital EMS Strike", logo: "images/orbital_ems_strike.svg", sequence: ["right", "right", "left", "down"], sounds: ['sounds/stratagems/destroyer-deploying-non-lethal.mp3'] },
        { name: "Orbital Smoke Strike", logo: "images/orbital_smoke_strike.svg", sequence: ["right", "right", "down", "up"], sounds: ['sounds/stratagems/destroyer-deploying-smoke-screen.mp3'] },
        // Eagle
        { name: "Eagle Strafing Run", logo: "images/eagle_strafing_run.svg", sequence: ["up", "right", "right"], sounds: EAGLE_SOUNDS },
        { name: "Eagle Airstrike", logo: "images/eagle_airstrike.svg", sequence: ["up", "right", "down", "right"], sounds: EAGLE_SOUNDS },
        { name: "Eagle Cluster Bomb", logo: "images/eagle_cluster_bomb.svg", sequence: ["up", "right", "down", "down", "right"], sounds: EAGLE_SOUNDS },
        { name: "Eagle Napalm Airstrike", logo: "images/eagle_napalm_airstrike.svg", sequence: ["up", "right", "down", "up"], sounds: EAGLE_SOUNDS },
        { name: "Eagle Smoke Strike", logo: "images/eagle_smoke_strike.svg", sequence: ["up", "right", "up", "down"], sounds: EAGLE_SOUNDS },
        { name: "Eagle 110MM Rocket Pods", logo: "images/eagle_110mm_rocket_pods.svg", sequence: ["up", "right", "up", "left"], sounds: EAGLE_SOUNDS },
        { name: "Eagle 500kg Bomb", logo: "images/eagle_500kg_bomb.svg", sequence: ["up", "right", "down", "down", "down"], sounds: EAGLE_SOUNDS },
        // Backpacks (new)
        { name: "SH-51 Directional Shield", logo: "images/sh_51_directional_shield.svg", sequence: ["down", "up", "left", "right", "up", "up"], sounds: BACKPACK_SOUNDS },
        { name: "AX/FLAM-75 Hot Dog", logo: "images/ax_flam_75_hot_dog.svg", sequence: ["down", "up", "left", "up", "left", "left"], sounds: BACKPACK_SOUNDS },
        { name: "B-100 Portable Hellbomb", logo: "images/b_100_portable_hellbomb.svg", sequence: ["down", "right", "up", "up", "up"], sounds: ['sounds/stratagems/destroyer-hellbomb-approved.mp3'] },
        { name: "AX/ARC-3 K-9", logo: "images/ax_arc_3_k9.svg", sequence: ["down", "up", "left", "up", "right", "left"], sounds: BACKPACK_SOUNDS },
        { name: "LIFT-860 Hover Pack", logo: "images/lift_860_hover_pack.svg", sequence: ["down", "up", "up", "down", "left", "right"], sounds: BACKPACK_SOUNDS },
        { name: "AX/TX-13 Dog Breath", logo: "images/ax_tx_13_dog_breath.svg", sequence: ["down", "up", "left", "up", "right", "up"], sounds: BACKPACK_SOUNDS },
        { name: "LIFT-182 Warp Pack", logo: "images/lift_182_warp_pack.svg", sequence: ["down", "left", "right", "down", "left", "right"], sounds: BACKPACK_SOUNDS },
        // Vehicles
        { name: "EXO-45 Patriot Exosuit", logo: "images/exo_45_patriot_exosuit.svg", sequence: ["left", "down", "right", "up", "left", "down", "down"], sounds: BACKPACK_SOUNDS },
        { name: "EXO-49 Emancipator Exosuit", logo: "images/exo_49_emancipator_exosuit.svg", sequence: ["left", "down", "right", "up", "left", "down", "up"], sounds: BACKPACK_SOUNDS },
        { name: "M-102 Fast Recon Vehicle", logo: "images/m_102_fast_recon_vehicle.svg", sequence: ["left", "down", "right", "down", "right", "down", "up"], sounds: BACKPACK_SOUNDS },
        { name: "TD-220 Bastion MK XVI", logo: "images/td_220_bastion_mk_xvi.svg", sequence: ["left", "down", "right", "down", "left", "down", "up", "down", "up"], sounds: BACKPACK_SOUNDS },
    ];

    // --- DOM refs ---
    var stratagemScreen = document.getElementById('stratagem-screen');
    var displayElement = document.getElementById('stratagem-display');
    var logoElement = document.getElementById('stratagem-logo');
    var nameElement = document.getElementById('stratagem-name');
    var sequenceDisplay = document.getElementById('sequence-display');
    var errorDisplay = document.getElementById('error-display');
    var overlay = document.getElementById('overlay');

    // --- State ---
    var inputSequence = [];
    var isProcessing = false;

    // --- Audio (deferred until app screen) ---
    function initAudio() {
        lowLag.init({ urlPrefix: 'sounds/', debug: '' });
        lowLag.load(['activation.mp3', 'activation.ogg'], 'activation');
        lowLag.load(['error.mp3', 'error.ogg'], 'error');
        lowLag.load(['button-up.mp3', 'button-up.ogg'], 'up');
        lowLag.load(['button-down.mp3', 'button-down.ogg'], 'down');
        lowLag.load(['button-left.mp3', 'button-left.ogg'], 'left');
        lowLag.load(['button-right.mp3', 'button-right.ogg'], 'right');
    }

    // --- Service Worker ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

    // --- Portrait: try native orientation lock ---
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(function () {});
    }

    // --- Apply orientation flip config ---
    if (FLIP_ORIENTATION) {
        document.documentElement.classList.add('rotation-alt');
    }

    // --- Input handling ---

    function handleDirection(direction) {
        if (isProcessing) return;
        resetIdleTimer();

        inputSequence.push(direction);
        appendToSequenceDisplay(direction);

        var match = findMatch();

        if (match && match.sequence.length === inputSequence.length) {
            lowLag.play('activation');
            displayStratagem(match);
        } else if (match) {
            lowLag.play(direction);
        } else {
            lowLag.play('error');
            displayError();
        }
    }

    var touchFired = false;

    document.querySelectorAll('.arrow').forEach(function (arrow) {
        arrow.addEventListener('touchstart', function (e) {
            e.preventDefault();
            touchFired = true;
            handleDirection(arrow.id.split('-')[0]);
        });

        arrow.addEventListener('click', function (e) {
            if (touchFired) {
                touchFired = false;
                return;
            }
            handleDirection(arrow.id.split('-')[0]);
        });
    });

    var KEY_MAP = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
        W: 'up', S: 'down', A: 'left', D: 'right',
        z: 'up', q: 'left',
        Z: 'up', Q: 'left',
    };

    document.addEventListener('keydown', function (e) {
        var direction = KEY_MAP[e.key];
        if (direction) {
            e.preventDefault();
            handleDirection(direction);
        }
    });

    // --- Sequence matching ---

    function findMatch() {
        return STRATAGEMS.find(function (s) {
            if (s.sequence.length < inputSequence.length) return false;
            return inputSequence.every(function (dir, i) {
                return dir === s.sequence[i];
            });
        });
    }

    // --- Display ---

    function appendToSequenceDisplay(direction) {
        var img = document.createElement('img');
        img.src = 'images/' + direction + '-arrow.svg';
        img.alt = direction;
        sequenceDisplay.appendChild(img);
    }

    function clearSequenceDisplay() {
        sequenceDisplay.innerHTML = '';
    }

    function resetInput() {
        inputSequence = [];
        clearSequenceDisplay();
    }

    var stratStatus = document.getElementById('strat-status');

    function dismissStratagem(e) {
        if (e) e.preventDefault();
        stratagemScreen.removeEventListener('click', dismissStratagem);
        stratagemScreen.removeEventListener('touchstart', dismissStratagem);
        document.removeEventListener('keydown', dismissStratagem);
        clearTimeout(stratagemSoundTimer);
        if (stratagemAudio) {
            stratagemAudio.pause();
            stratagemAudio = null;
        }
        stratagemScreen.classList.add('strat-dismiss');
        setTimeout(function () {
            stratagemScreen.classList.add('hidden');
            stratagemScreen.classList.remove('strat-dismiss');
            appScreen.classList.remove('hidden');
            stratStatus.classList.remove('sent');
            resetInput();
            isProcessing = false;
            resetIdleTimer();
        }, 300);
    }

    var stratagemAudio = null;
    var stratagemSoundTimer = null;

    function playStratagemSound(stratagem) {
        clearTimeout(stratagemSoundTimer);
        if (stratagemAudio) {
            stratagemAudio.pause();
            stratagemAudio = null;
        }
        if (stratagem.sounds && stratagem.sounds.length) {
            stratagemAudio = new Audio(randomFrom(stratagem.sounds));
            stratagemAudio.preload = 'auto';
            stratagemSoundTimer = setTimeout(function () {
                stratagemAudio.play().catch(function () {});
            }, CONFIG.VOICELINE_DELAY);
        }
    }

    function displayStratagem(stratagem) {
        isProcessing = true;
        stopIdleTimer();
        logoElement.src = stratagem.logo;
        nameElement.textContent = stratagem.name;
        stratStatus.classList.remove('sent');
        playStratagemSound(stratagem);

        appScreen.classList.add('hidden');
        stratagemScreen.classList.remove('hidden', 'strat-dismiss');

        // Restart progress bar animation via inline style
        var bar = document.getElementById('strat-progress-bar');
        bar.style.animation = 'none';
        requestAnimationFrame(function () {
            bar.style.animation = 'progress-load ' + (STRATAGEM_DURATION / 1000) + 's linear forwards';
        });

        setTimeout(function () {
            stratStatus.classList.add('sent');
            if (CONFIG.AUTO_DISMISS_STRATAGEM) {
                setTimeout(function () { dismissStratagem(); }, 1000);
            } else {
                stratagemScreen.addEventListener('click', dismissStratagem);
                stratagemScreen.addEventListener('touchstart', dismissStratagem);
                document.addEventListener('keydown', dismissStratagem);
            }
        }, STRATAGEM_DURATION);
    }

    function displayError() {
        isProcessing = true;
        errorDisplay.classList.remove('hidden');
        overlay.classList.remove('hidden');
        setTimeout(function () {
            errorDisplay.classList.add('hidden');
            overlay.classList.add('hidden');
            resetInput();
            isProcessing = false;
            resetIdleTimer();
        }, ERROR_DURATION);
    }

    // --- Start ---
    if (CONFIG.SKIP_BOOT) {
        showWelcome();
    } else {
        runBootSequence();
    }
})();
