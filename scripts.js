(function () {
    'use strict';

    // --- Constants ---
    const DISPLAY_DURATION = 3000;
    const ERROR_DURATION = 1000;

    const STRATAGEMS = [
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
        { name: "E/MG-101 HMG Emplacement", logo: "images/e_mg_101_hmg_emplacement.svg", sequence: ["down", "up", "left", "right", "right", "left"] },
        { name: "FX-12 Shield Generator Relay", logo: "images/fx_12_shield_generator_relay.svg", sequence: ["down", "down", "left", "right", "left", "right"] },
        { name: "A/ARC-3 Tesla Tower", logo: "images/a_arc_3_tesla_tower.svg", sequence: ["down", "up", "right", "up", "left", "right"] },
        { name: "MD-6 Anti-Personnel Minefield", logo: "images/md_6_anti_personnel_minefield.svg", sequence: ["down", "left", "up", "right"] },
        { name: "MD-14 Incendiary Mines", logo: "images/md_14_incendiary_mines.svg", sequence: ["down", "left", "left", "down"] },
        { name: "A/MG-43 Machine Gun Sentry", logo: "images/a_mg_43_machine_gun_sentry.svg", sequence: ["down", "up", "right", "right", "up"] },
        { name: "A/G-16 Gatling Sentry", logo: "images/a_g_16_gatling_sentry.svg", sequence: ["down", "up", "right", "left"] },
        { name: "A/M-12 Mortar Sentry", logo: "images/a_m_12_mortar_sentry.svg", sequence: ["down", "up", "right", "right", "down"] },
        { name: "A/AC-8 Autocannon Sentry", logo: "images/a_ac_8_autocannon_sentry.svg", sequence: ["down", "up", "right", "up", "left", "up"] },
        { name: "A/MLS-4X Rocket Sentry", logo: "images/a_mls_4x_rocket_sentry.svg", sequence: ["down", "up", "right", "right", "left"] },
        { name: "A/M-23 EMS Mortar Sentry", logo: "images/a_m_23_ems_mortar_sentry.svg", sequence: ["down", "up", "right", "down", "right"] },
        { name: "Orbital Gatling Barrage", logo: "images/orbital_gatling_barrage.svg", sequence: ["right", "down", "left", "up", "up"] },
        { name: "Orbital Airburst Strike", logo: "images/orbital_airburst_strike.svg", sequence: ["right", "right", "right"] },
        { name: "Orbital 120MM HE Barrage", logo: "images/orbital_120mm_he_barrage.svg", sequence: ["right", "right", "down", "left", "right", "down"] },
        { name: "Orbital 380MM HE Barrage", logo: "images/orbital_380mm_he_barrage.svg", sequence: ["right", "down", "up", "up", "left", "down", "down"] },
        { name: "Orbital Walking Barrage", logo: "images/orbital_walking_barrage.svg", sequence: ["right", "down", "right", "down", "right", "down"] },
        { name: "Orbital Laser", logo: "images/orbital_laser.svg", sequence: ["right", "down", "up", "right", "down"] },
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
    ];

    // --- DOM refs ---
    const displayElement = document.getElementById('stratagem-display');
    const logoElement = document.getElementById('stratagem-logo');
    const nameElement = document.getElementById('stratagem-name');
    const sequenceDisplay = document.getElementById('sequence-display');
    const errorDisplay = document.getElementById('error-display');
    const overlay = document.getElementById('overlay');

    // --- State ---
    let inputSequence = [];
    let isProcessing = false;

    // --- Audio init ---
    lowLag.init({ urlPrefix: 'sounds/', debug: '' });
    lowLag.load(['activation.mp3', 'activation.ogg'], 'activation');
    lowLag.load(['error.mp3', 'error.ogg'], 'error');
    lowLag.load(['button-up.mp3', 'button-up.ogg'], 'up');
    lowLag.load(['button-down.mp3', 'button-down.ogg'], 'down');
    lowLag.load(['button-left.mp3', 'button-left.ogg'], 'left');
    lowLag.load(['button-right.mp3', 'button-right.ogg'], 'right');

    // --- Service Worker ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

    // --- Portrait: try native orientation lock (works in installed PWA) ---
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(function () {});
    }

    // --- Input handling ---

    function handleDirection(direction) {
        if (isProcessing) return;

        inputSequence.push(direction);
        appendToSequenceDisplay(direction);

        const match = findMatch();

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

    // Prevent touchstart + click double-fire on mobile
    let touchFired = false;

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

    // Keyboard support (arrows + WASD)
    var KEY_MAP = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
        W: 'up', S: 'down', A: 'left', D: 'right',
        z: 'up', q: 'left',  // AZERTY
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
        setTimeout(function () {
            displayElement.classList.add('hidden');
            overlay.classList.add('hidden');
            resetInput();
            isProcessing = false;
        }, DISPLAY_DURATION);
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
        }, ERROR_DURATION);
    }
})();
