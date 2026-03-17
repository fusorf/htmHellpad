(function () {
    'use strict';

    // --- Config ---
    var FLIP_ORIENTATION = false; // set to true to flip portrait rotation 180°

    // --- Constants ---
    var ERROR_DURATION = 1000;
    var IDLE_TIMEOUT = 10000;

    // --- Boot sequence (weight = relative display time) ---
    var BOOT_LINES = [
        { text: '[INIT] SEAF Combat Terminal v4.2.1', weight: 2 },
        { text: '[POST] Running power-on self-test...', weight: 4 },
        { text: '[  OK] Memory check: 512MB SuperRAM ............ PASS', weight: 3 },
        { text: '[  OK] Neural interface adapter ............. DETECTED', weight: 1 },
        { text: '[  OK] Stratagem uplink module SU-47 ........ ONLINE', weight: 1 },
        { text: '[  OK] Encryption layer AES-512 ............. ACTIVE', weight: 1 },
        { text: '[BOOT] Loading Super Earth Defense Protocol v12.7', weight: 5 },
        { text: '[  OK] Democracy enforcement module ......... LOADED', weight: 2 },
        { text: '[  OK] Orbital relay frequency locked ....... 447.200 MHz', weight: 1 },
        { text: '[  OK] Eagle CAS datalink .................. SYNCED', weight: 1 },
        { text: '[WARN] Firmware update available (v12.8.1)', weight: 3 },
        { text: '[  OK] Atmospheric targeting calibration .... NOMINAL', weight: 4 },
        { text: '[  OK] Hellbomb safety interlock ............ ARMED', weight: 1 },
        { text: '[  OK] IFF transponder ...................... BROADCASTING', weight: 1 },
        { text: '[  OK] Managed democracy subroutine ......... INITIALIZED', weight: 2 },
        { text: '[  OK] Anti-bug countermeasures ............. ACTIVE', weight: 1 },
        { text: '[  OK] Anti-automaton protocols ............. STANDBY', weight: 1 },
        { text: '[  OK] Galactic map telemetry ............... RECEIVING', weight: 3 },
        { text: '[  OK] Liberty propagation array ............ NOMINAL', weight: 1 },
        { text: '[BOOT] Mounting /dev/stratagem ...', weight: 5 },
        { text: '[  OK] 82 stratagems loaded from SEAF database', weight: 2 },
        { text: '[  OK] Audio subsystem ...................... READY', weight: 1 },
        { text: '[  OK] Touch input calibration .............. COMPLETE', weight: 1 },
        { text: '[  OK] Display driver ....................... ACTIVE', weight: 1 },
        { text: '======================================================', weight: 1 },
        { text: '  SUPER EARTH ARMED FORCES — HELLPAD TERMINAL', weight: 1 },
        { text: '  Classification: RESTRICTED // SEAF-EYES-ONLY', weight: 1 },
        { text: '  Operator: HELLDIVER [UNREGISTERED]', weight: 1 },
        { text: '======================================================', weight: 1 },
        { text: '[BOOT] System ready. Launching interface...', weight: 5 },
    ];

    var BOOT_DURATION = 3000;
    var totalWeight = BOOT_LINES.reduce(function (sum, l) { return sum + l.weight; }, 0);

    var bootScreen = document.getElementById('boot-screen');
    var bootLog = document.getElementById('boot-log');
    var welcomeScreen = document.getElementById('welcome-screen');
    var appScreen = document.getElementById('app');

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

            if (line.indexOf('[  OK]') === 0) {
                span.innerHTML = '<span class="boot-ok">[  OK]</span>' + escapeHtml(line.substring(6));
            } else if (line.indexOf('[WARN]') === 0) {
                span.innerHTML = '<span class="boot-warn">[WARN]</span>' + escapeHtml(line.substring(6));
            } else if (line.indexOf('[FAIL]') === 0) {
                span.innerHTML = '<span class="boot-fail">[FAIL]</span>' + escapeHtml(line.substring(6));
            } else {
                span.textContent = line;
            }

            bootLog.appendChild(span);
            bootLog.scrollTop = bootLog.scrollHeight;

            var delay = (entry.weight / totalWeight) * BOOT_DURATION;
            // Last line: hold for 500ms before transitioning
            if (i === BOOT_LINES.length - 1) {
                delay = 500;
            }
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

        function onTap(e) {
            e.preventDefault();
            welcomeScreen.removeEventListener('click', onTap);
            welcomeScreen.removeEventListener('touchstart', onTap);
            showApp();
        }
        welcomeScreen.addEventListener('click', onTap);
        welcomeScreen.addEventListener('touchstart', onTap);
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

    // --- Stratagems ---
    var STRATAGEMS = [
        { name: "LIFT-850 Jump Pack", logo: "images/lift_850_jump_pack.svg", sequence: ["down", "up", "up", "down", "up"] },
        { name: "B-1 Supply Pack", logo: "images/b_1_supply_pack.svg", sequence: ["down", "left", "down", "up", "up", "down"] },
        { name: "AX/LAS-5 'Guard Dog' Rover", logo: "images/ax_las_5_guard_dog_rover.svg", sequence: ["down", "up", "left", "up", "right", "right"] },
        { name: "SH-20 Ballistic Shield Backpack", logo: "images/sh_20_ballistic_shield_backpack.svg", sequence: ["down", "left", "down", "down", "up", "left"] },
        { name: "SH-32 Shield Generator Pack", logo: "images/sh_32_shield_generator_pack.svg", sequence: ["down", "up", "left", "right", "left", "right"] },
        { name: "AX/AR-23 'Guard Dog'", logo: "images/ax_ar_23_guard_dog.svg", sequence: ["down", "up", "left", "up", "right", "down"] },
        { name: "MG-43 Machine Gun", logo: "images/mg_43_machine_gun.svg", sequence: ["down", "left", "down", "up", "right"] },
        { name: "APW-1 Anti-Materiel Rifle", logo: "images/apw_1_anti_materiel_rifle.svg", sequence: ["down", "left", "right", "up", "down"] },
        { name: "M-105 Stalwart", logo: "images/m_105_stalwart.svg", sequence: ["down", "left", "down", "up", "up", "left"] },
        { name: "EAT-17 Expendable Anti-tank", logo: "images/eat_17_expendable_anti_tank.svg", sequence: ["down", "down", "left", "up", "right"] },
        { name: "GR-8 Recoilless Rifle", logo: "images/gr_8_recoilless_rifle.svg", sequence: ["down", "left", "right", "right", "left"] },
        { name: "FLAM-40 Flamethrower", logo: "images/flam_40_flamethrower.svg", sequence: ["down", "left", "up", "down", "up"] },
        { name: "AC-8 Autocannon", logo: "images/ac_8_autocannon.svg", sequence: ["down", "left", "down", "up", "up", "right"] },
        { name: "MG-206 Heavy Machine Gun", logo: "images/mg_206_heavy_machine_gun.svg", sequence: ["down", "left", "up", "down", "down"] },
        { name: "RS-422 Railgun", logo: "images/rs_422_railgun.svg", sequence: ["down", "right", "down", "up", "left", "right"] },
        { name: "FAF-14 SPEAR Launcher", logo: "images/faf_14_spear_launcher.svg", sequence: ["down", "down", "up", "down", "down"] },
        { name: "GL-21 Grenade Launcher", logo: "images/gl_21_grenade_launcher.svg", sequence: ["down", "left", "up", "left", "down"] },
        { name: "LAS-98 Laser Cannon", logo: "images/las_98_laser_cannon.svg", sequence: ["down", "left", "down", "up", "left"] },
        { name: "ARC-3 Arc Thrower", logo: "images/arc_3_arc_thrower.svg", sequence: ["down", "right", "down", "up", "left", "left"] },
        { name: "LAS-99 Quasar Cannon", logo: "images/las_99_quasar_cannon.svg", sequence: ["down", "down", "up", "left", "right"] },
        { name: "RL-77 Airburst Rocket Launcher", logo: "images/rl_77_airburst_rocket_launcher.svg", sequence: ["down", "up", "up", "left", "right"] },
        { name: "MLS-4X Commando", logo: "images/mls_4x_commando.svg", sequence: ["down", "left", "up", "down", "right"] },
        { name: "StA-X3 W.A.S.P. Launcher", logo: "images/sta_x3_wasp_launcher.svg", sequence: ["down", "down", "up", "down", "right"] },
        { name: "PLAS-45 Epoch", logo: "images/plas_45_epoch.svg", sequence: ["down", "left", "up", "left", "right"] },
        { name: "CQC-20 Breaching Hammer", logo: "images/cqc_20_breaching_hammer.svg", sequence: ["down", "left", "right", "left", "up"] },
        { name: "S-11 Speargun", logo: "images/s_11_speargun.svg", sequence: ["down", "right", "down", "left", "up", "right"] },
        { name: "EAT-700 Expendable Napalm", logo: "images/eat_700_expendable_napalm.svg", sequence: ["down", "down", "left", "up", "left"] },
        { name: "TX-41 Sterilizer", logo: "images/tx_41_sterilizer.svg", sequence: ["down", "left", "up", "down", "left"] },
        { name: "CQC-9 Defoliation Tool", logo: "images/cqc_9_defoliation_tool.svg", sequence: ["down", "left", "right", "right", "down"] },
        { name: "GL-52 De-Escalator", logo: "images/gl_52_de_escalator.svg", sequence: ["down", "right", "up", "left", "right"] },
        { name: "EAT-411 Leveller", logo: "images/eat_411_leveller.svg", sequence: ["down", "down", "left", "up", "down"] },
        { name: "B/MD C4 Pack", logo: "images/b_md_c4_pack.svg", sequence: ["down", "right", "up", "up", "right", "up"] },
        { name: "MS-11 Solo Silo", logo: "images/ms_11_solo_silo.svg", sequence: ["down", "up", "right", "down", "down"] },
        { name: "GL-28 Belt-Fed Grenade Launcher", logo: "images/gl_28_belt_fed_grenade_launcher.svg", sequence: ["down", "left", "up", "left", "up", "up"] },
        { name: "M-1000 Maxigun", logo: "images/m_1000_maxigun.svg", sequence: ["down", "left", "right", "down", "up", "up"] },
        { name: "CQC-1 One True Flag", logo: "images/cqc_1_one_true_flag.svg", sequence: ["down", "left", "right", "right", "up"] },
        { name: "E/MG-101 HMG Emplacement", logo: "images/e_mg_101_hmg_emplacement.svg", sequence: ["down", "up", "left", "right", "right", "left"] },
        { name: "FX-12 Shield Generator Relay", logo: "images/fx_12_shield_generator_relay.svg", sequence: ["down", "down", "left", "right", "left", "right"] },
        { name: "A/ARC-3 Tesla Tower", logo: "images/a_arc_3_tesla_tower.svg", sequence: ["down", "up", "right", "up", "left", "right"] },
        { name: "MD-6 Anti-Personnel Minefield", logo: "images/md_6_anti_personnel_minefield.svg", sequence: ["down", "left", "up", "right"] },
        { name: "MD-14 Incendiary Mines", logo: "images/md_14_incendiary_mines.svg", sequence: ["down", "left", "left", "down"] },
        { name: "MD-17 Anti-Tank Mines", logo: "images/md_17_anti_tank_mines.svg", sequence: ["down", "left", "up", "up"] },
        { name: "MD-8 Gas Mines", logo: "images/md_8_gas_mines.svg", sequence: ["down", "left", "left", "right"] },
        { name: "E/GL-21 Grenadier Battlement", logo: "images/e_gl_21_grenadier_battlement.svg", sequence: ["down", "right", "down", "left", "right"] },
        { name: "E/AT-12 Anti-Tank Emplacement", logo: "images/e_at_12_anti_tank_emplacement.svg", sequence: ["down", "up", "left", "right", "right", "right"] },
        { name: "A/MG-43 Machine Gun Sentry", logo: "images/a_mg_43_machine_gun_sentry.svg", sequence: ["down", "up", "right", "right", "up"] },
        { name: "A/G-16 Gatling Sentry", logo: "images/a_g_16_gatling_sentry.svg", sequence: ["down", "up", "right", "left"] },
        { name: "A/M-12 Mortar Sentry", logo: "images/a_m_12_mortar_sentry.svg", sequence: ["down", "up", "right", "right", "down"] },
        { name: "A/AC-8 Autocannon Sentry", logo: "images/a_ac_8_autocannon_sentry.svg", sequence: ["down", "up", "right", "up", "left", "up"] },
        { name: "A/MLS-4X Rocket Sentry", logo: "images/a_mls_4x_rocket_sentry.svg", sequence: ["down", "up", "right", "right", "left"] },
        { name: "A/M-23 EMS Mortar Sentry", logo: "images/a_m_23_ems_mortar_sentry.svg", sequence: ["down", "up", "right", "down", "right"] },
        { name: "A/LAS-98 Laser Sentry", logo: "images/a_las_98_laser_sentry.svg", sequence: ["down", "up", "right", "down", "up", "right"] },
        { name: "A/FLAM-40 Flame Sentry", logo: "images/a_flam_40_flame_sentry.svg", sequence: ["down", "up", "right", "down", "up", "up"] },
        { name: "Orbital Gatling Barrage", logo: "images/orbital_gatling_barrage.svg", sequence: ["right", "down", "left", "up", "up"] },
        { name: "Orbital Airburst Strike", logo: "images/orbital_airburst_strike.svg", sequence: ["right", "right", "right"] },
        { name: "Orbital 120MM HE Barrage", logo: "images/orbital_120mm_he_barrage.svg", sequence: ["right", "right", "down", "left", "right", "down"] },
        { name: "Orbital 380MM HE Barrage", logo: "images/orbital_380mm_he_barrage.svg", sequence: ["right", "down", "up", "up", "left", "down", "down"] },
        { name: "Orbital Walking Barrage", logo: "images/orbital_walking_barrage.svg", sequence: ["right", "down", "right", "down", "right", "down"] },
        { name: "Orbital Laser", logo: "images/orbital_laser.svg", sequence: ["right", "down", "up", "right", "down"] },
        { name: "Orbital Napalm Barrage", logo: "images/orbital_napalm_barrage.svg", sequence: ["right", "right", "down", "left", "right", "up"] },
        { name: "Orbital Railcannon Strike", logo: "images/orbital_railcannon_strike.svg", sequence: ["right", "up", "down", "down", "right"] },
        { name: "Orbital Precision Strike", logo: "images/orbital_precision_strike.svg", sequence: ["right", "right", "up"] },
        { name: "Orbital Gas Strike", logo: "images/orbital_gas_strike.svg", sequence: ["right", "right", "down", "right"] },
        { name: "Orbital EMS Strike", logo: "images/orbital_ems_strike.svg", sequence: ["right", "right", "left", "down"] },
        { name: "Orbital Smoke Strike", logo: "images/orbital_smoke_strike.svg", sequence: ["right", "right", "down", "up"] },
        { name: "Eagle Strafing Run", logo: "images/eagle_strafing_run.svg", sequence: ["up", "right", "right"] },
        { name: "Eagle Airstrike", logo: "images/eagle_airstrike.svg", sequence: ["up", "right", "down", "right"] },
        { name: "Eagle Cluster Bomb", logo: "images/eagle_cluster_bomb.svg", sequence: ["up", "right", "down", "down", "right"] },
        { name: "Eagle Napalm Airstrike", logo: "images/eagle_napalm_airstrike.svg", sequence: ["up", "right", "down", "up"] },
        { name: "Eagle Smoke Strike", logo: "images/eagle_smoke_strike.svg", sequence: ["up", "right", "up", "down"] },
        { name: "Eagle 110MM Rocket Pods", logo: "images/eagle_110mm_rocket_pods.svg", sequence: ["up", "right", "up", "left"] },
        { name: "Eagle 500kg Bomb", logo: "images/eagle_500kg_bomb.svg", sequence: ["up", "right", "down", "down", "down"] },
        // Backpacks (new)
        { name: "SH-51 Directional Shield", logo: "images/sh_51_directional_shield.svg", sequence: ["down", "up", "left", "right", "up", "up"] },
        { name: "AX/FLAM-75 Hot Dog", logo: "images/ax_flam_75_hot_dog.svg", sequence: ["down", "up", "left", "up", "left", "left"] },
        { name: "B-100 Portable Hellbomb", logo: "images/b_100_portable_hellbomb.svg", sequence: ["down", "right", "up", "up", "up"] },
        { name: "AX/ARC-3 K-9", logo: "images/ax_arc_3_k9.svg", sequence: ["down", "up", "left", "up", "right", "left"] },
        { name: "LIFT-860 Hover Pack", logo: "images/lift_860_hover_pack.svg", sequence: ["down", "up", "up", "down", "left", "right"] },
        { name: "AX/TX-13 Dog Breath", logo: "images/ax_tx_13_dog_breath.svg", sequence: ["down", "up", "left", "up", "right", "up"] },
        { name: "LIFT-182 Warp Pack", logo: "images/lift_182_warp_pack.svg", sequence: ["down", "left", "right", "down", "left", "right"] },
        // Vehicles
        { name: "EXO-45 Patriot Exosuit", logo: "images/exo_45_patriot_exosuit.svg", sequence: ["left", "down", "right", "up", "left", "down", "down"] },
        { name: "EXO-49 Emancipator Exosuit", logo: "images/exo_49_emancipator_exosuit.svg", sequence: ["left", "down", "right", "up", "left", "down", "up"] },
        { name: "M-102 Fast Recon Vehicle", logo: "images/m_102_fast_recon_vehicle.svg", sequence: ["left", "down", "right", "down", "right", "down", "up"] },
        { name: "TD-220 Bastion MK XVI", logo: "images/td_220_bastion_mk_xvi.svg", sequence: ["left", "down", "right", "down", "left", "down", "up", "down", "up"] },
    ];

    // --- DOM refs ---
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

    function displayStratagem(stratagem) {
        isProcessing = true;
        logoElement.src = stratagem.logo;
        nameElement.textContent = stratagem.name;
        displayElement.classList.remove('hidden');
        overlay.classList.remove('hidden');

        function dismiss(e) {
            e.preventDefault();
            e.stopPropagation();
            overlay.removeEventListener('click', dismiss);
            overlay.removeEventListener('touchstart', dismiss);
            displayElement.removeEventListener('click', dismiss);
            displayElement.removeEventListener('touchstart', dismiss);
            displayElement.classList.add('hidden');
            overlay.classList.add('hidden');
            resetInput();
            isProcessing = false;
            resetIdleTimer();
        }
        overlay.addEventListener('click', dismiss);
        overlay.addEventListener('touchstart', dismiss);
        displayElement.addEventListener('click', dismiss);
        displayElement.addEventListener('touchstart', dismiss);
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

    // --- Start boot sequence ---
    runBootSequence();
})();
