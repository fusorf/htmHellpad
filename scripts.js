const stratagems = [
    {
        "name": "LIFT-850 Jump Pack",
        "enum": "lift_850_jump_pack",
        "logo": "images/lift_850_jump_pack.svg",
        "sequence": ["down", "up", "up", "down", "up"]
    },
    {
        "name": "B-1 Supply Pack",
        "enum": "b_1_supply_pack",
        "logo": "images/b_1_supply_pack.svg",
        "sequence": ["down", "left", "down", "up", "up", "down"]
    },
    {
        "name": "AX/LAS-5 'Guard Dog' Rover",
        "enum": "ax_las_5_guard_dog_rover",
        "logo": "images/ax_las_5_guard_dog_rover.svg",
        "sequence": ["down", "up", "left", "up", "right", "right"]
    },
    {
        "name": "SH-20 Ballistic Shield Backpack",
        "enum": "sh_20_ballistic_shield_backpack",
        "logo": "images/sh_20_ballistic_shield_backpack.svg",
        "sequence": ["down", "left", "down", "down", "up", "left"]
    },
    {
        "name": "SH-32 Shield Generator Pack",
        "enum": "sh_32_shield_generator_pack",
        "logo": "images/sh_32_shield_generator_pack.svg",
        "sequence": ["down", "up", "left", "right", "left", "right"]
    },
    {
        "name": "AX/AR-23 'Guard Dog'",
        "enum": "ax_ar_23_guard_dog",
        "logo": "images/ax_ar_23_guard_dog.svg",
        "sequence": ["down", "up", "left", "up", "right", "down"]
    },
    {
        "name": "MG-43 Machine Gun",
        "enum": "mg_43_machine_gun",
        "logo": "images/mg_43_machine_gun.svg",
        "sequence": ["down", "left", "down", "up", "right"]
    },
    {
        "name": "APW-1 Anti-Materiel Rifle",
        "enum": "apw_1_anti_materiel_rifle",
        "logo": "images/apw_1_anti_materiel_rifle.svg",
        "sequence": ["down", "left", "right", "up", "down"]
    },
    {
        "name": "M-105 Stalwart",
        "enum": "m_105_stalwart",
        "logo": "images/m_105_stalwart.svg",
        "sequence": ["down", "left", "down", "up", "up", "left"]
    },
    {
        "name": "EAT-17 Expendable Anti-tank",
        "enum": "eat_17_expendable_anti_tank",
        "logo": "images/eat_17_expendable_anti_tank.svg",
        "sequence": ["down", "down", "left", "up", "right"]
    },
    {
        "name": "GR-8 Recoilless Rifle",
        "enum": "gr_8_recoilless_rifle",
        "logo": "images/gr_8_recoilless_rifle.svg",
        "sequence": ["down", "left", "right", "right", "left"]
    },
    {
        "name": "FLAM-40 Flamethrower",
        "enum": "flam_40_flamethrower",
        "logo": "images/flam_40_flamethrower.svg",
        "sequence": ["down", "left", "up", "down", "up"]
    },
    {
        "name": "AC-8 Autocannon",
        "enum": "ac_8_autocannon",
        "logo": "images/ac_8_autocannon.svg",
        "sequence": ["down", "left", "down", "up", "up", "right"]
    },
    {
        "name": "MG-206 Heavy Machine Gun",
        "enum": "mg_206_heavy_machine_gun",
        "logo": "images/mg_206_heavy_machine_gun.svg",
        "sequence": ["down", "left", "up", "down", "down"]
    },
    {
        "name": "RS-422 Railgun",
        "enum": "rs_422_railgun",
        "logo": "images/rs_422_railgun.svg",
        "sequence": ["down", "right", "down", "up", "left", "right"]
    },
    {
        "name": "FAF-14 SPEAR Launcher",
        "enum": "faf_14_spear_launcher",
        "logo": "images/faf_14_spear_launcher.svg",
        "sequence": ["down", "down", "up", "down", "down"]
    },
    {
        "name": "GL-21 Grenade Launcher",
        "enum": "gl_21_grenade_launcher",
        "logo": "images/gl_21_grenade_launcher.svg",
        "sequence": ["down", "left", "up", "left", "down"]
    },
    {
        "name": "LAS-98 Laser Cannon",
        "enum": "las_98_laser_cannon",
        "logo": "images/las_98_laser_cannon.svg",
        "sequence": ["down", "left", "down", "up", "left"]
    },
    {
        "name": "ARC-3 Arc Thrower",
        "enum": "arc_3_arc_thrower",
        "logo": "images/arc_3_arc_thrower.svg",
        "sequence": ["down", "right", "down", "up", "left", "left"]
    },
    {
        "name": "LAS-99 Quasar Cannon",
        "enum": "las_99_quasar_cannon",
        "logo": "images/las_99_quasar_cannon.svg",
        "sequence": ["down", "down", "up", "left", "right"]
    },
    {
        "name": "RL-77 Airburst Rocket Launcher",
        "enum": "rl_77_airburst_rocket_launcher",
        "logo": "images/rl_77_airburst_rocket_launcher.svg",
        "sequence": ["down", "up", "up", "left", "right"]
    },
    {
        "name": "E/MG-101 HMG Emplacement",
        "enum": "e_mg_101_hmg_emplacement",
        "logo": "images/e_mg_101_hmg_emplacement.svg",
        "sequence": ["down", "up", "left", "right", "right", "left"]
    },
    {
        "name": "FX-12 Shield Generator Relay",
        "enum": "fx_12_shield_generator_relay",
        "logo": "images/fx_12_shield_generator_relay.svg",
        "sequence": ["down", "down", "left", "right", "left", "right"]
    },
    {
        "name": "A/ARC-3 Tesla Tower",
        "enum": "a_arc_3_tesla_tower",
        "logo": "images/a_arc_3_tesla_tower.svg",
        "sequence": ["down", "up", "right", "up", "left", "right"]
    },
    {
        "name": "MD-6 Anti-Personnel Minefield",
        "enum": "md_6_anti_personnel_minefield",
        "logo": "images/md_6_anti_personnel_minefield.svg",
        "sequence": ["down", "left", "up", "right"]
    },
    {
        "name": "MD-14 Incendiary Mines",
        "enum": "md_14_incendiary_mines",
        "logo": "images/md_14_incendiary_mines.svg",
        "sequence": ["down", "left", "left", "down"]
    },
    {
        "name": "A/MG-43 Machine Gun Sentry",
        "enum": "a_mg_43_machine_gun_sentry",
        "logo": "images/a_mg_43_machine_gun_sentry.svg",
        "sequence": ["down", "up", "right", "right", "up"]
    },
    {
        "name": "A/G-16 Gatling Sentry",
        "enum": "a_g_16_gatling_sentry",
        "logo": "images/a_g_16_gatling_sentry.svg",
        "sequence": ["down", "up", "right", "left"]
    },
    {
        "name": "A/M-12 Mortar Sentry",
        "enum": "a_m_12_mortar_sentry",
        "logo": "images/a_m_12_mortar_sentry.svg",
        "sequence": ["down", "up", "right", "right", "down"]
    },
    {
        "name": "A/AC-8 Autocannon Sentry",
        "enum": "a_ac_8_autocannon_sentry",
        "logo": "images/a_ac_8_autocannon_sentry.svg",
        "sequence": ["down", "up", "right", "up", "left", "up"]
    },
    {
        "name": "A/MLS-4X Rocket Sentry",
        "enum": "a_mls_4x_rocket_sentry",
        "logo": "images/a_mls_4x_rocket_sentry.svg",
        "sequence": ["down", "up", "right", "right", "left"]
    },
    {
        "name": "A/M-23 EMS Mortar Sentry",
        "enum": "a_m_23_ems_mortar_sentry",
        "logo": "images/a_m_23_ems_mortar_sentry.svg",
        "sequence": ["down", "up", "right", "down", "right"]
    },
    {
        "name": "Orbital Gatling Barrage",
        "enum": "orbital_gatling_barrage",
        "logo": "images/orbital_gatling_barrage.svg",
        "sequence": ["right", "down", "left", "up", "up"]
    },
    {
        "name": "Orbital Airburst Strike",
        "enum": "orbital_airburst_strike",
        "logo": "images/orbital_airburst_strike.svg",
        "sequence": ["right", "right", "right"]
    },
    {
        "name": "Orbital 120MM HE Barrage",
        "enum": "orbital_120mm_he_barrage",
        "logo": "images/orbital_120mm_he_barrage.svg",
        "sequence": ["right", "right", "down", "left", "right", "down"]
    },
    {
        "name": "Orbital 380MM HE Barrage",
        "enum": "orbital_380mm_he_barrage",
        "logo": "images/orbital_380mm_he_barrage.svg",
        "sequence": ["right", "down", "up", "up", "left", "down", "down"]
    },
    {
        "name": "Orbital Walking Barrage",
        "enum": "orbital_walking_barrage",
        "logo": "images/orbital_walking_barrage.svg",
        "sequence": ["right", "down", "right", "down", "right", "down"]
    },
    {
        "name": "Orbital Laser",
        "enum": "orbital_laser",
        "logo": "images/orbital_laser.svg",
        "sequence": ["right", "down", "up", "right", "down"]
    },
    {
        "name": "Orbital Railcannon Strike",
        "enum": "orbital_railcannon_strike",
        "logo": "images/orbital_railcannon_strike.svg",
        "sequence": ["right", "up", "down", "down", "right"]
    },
    {
        "name": "Orbital Precision Strike",
        "enum": "orbital_precision_strike",
        "logo": "images/orbital_precision_strike.svg",
        "sequence": ["right", "right", "up"]
    },
    {
        "name": "Orbital Gas Strike",
        "enum": "orbital_gas_strike",
        "logo": "images/orbital_gas_strike.svg",
        "sequence": ["right", "right", "down", "right"]
    },
    {
        "name": "Orbital EMS Strike",
        "enum": "orbital_ems_strike",
        "logo": "images/orbital_ems_strike.svg",
        "sequence": ["right", "right", "left", "down"]
    },
    {
        "name": "Orbital Smoke Strike",
        "enum": "orbital_smoke_strike",
        "logo": "images/orbital_smoke_strike.svg",
        "sequence": ["right", "right", "down", "up"]
    },
    {
        "name": "Eagle Strafing Run",
        "enum": "eagle_strafing_run",
        "logo": "images/eagle_strafing_run.svg",
        "sequence": ["up", "right", "right"]
    },
    {
        "name": "Eagle Airstrike",
        "enum": "eagle_airstrike",
        "logo": "images/eagle_airstrike.svg",
        "sequence": ["up", "right", "down", "right"]
    },
    {
        "name": "Eagle Cluster Bomb",
        "enum": "eagle_cluster_bomb",
        "logo": "images/eagle_cluster_bomb.svg",
        "sequence": ["up", "right", "down", "down", "right"]
    },
    {
        "name": "Eagle Napalm Airstrike",
        "enum": "eagle_napalm_airstrike",
        "logo": "images/eagle_napalm_airstrike.svg",
        "sequence": ["up", "right", "down", "up"]
    },
    {
        "name": "Eagle Smoke Strike",
        "enum": "eagle_smoke_strike",
        "logo": "images/eagle_smoke_strike.svg",
        "sequence": ["up", "right", "up", "down"]
    },
    {
        "name": "Eagle 110MM Rocket Pods",
        "enum": "eagle_110mm_rocket_pods",
        "logo": "images/eagle_110mm_rocket_pods.svg",
        "sequence": ["up", "right", "up", "left"]
    },
    {
        "name": "Eagle 500kg Bomb",
        "enum": "eagle_500kg_bomb",
        "logo": "images/eagle_500kg_bomb.svg",
        "sequence": ["up", "right", "down", "down", "down"]
    }
];

let inputSequence = [];

const displayElement = document.getElementById('stratagem-display');
const logoElement = document.getElementById('stratagem-logo');
const nameElement = document.getElementById('stratagem-name');
const sequenceDisplay = document.getElementById('sequence-display');
const stratagemSound = new Audio('sounds/activation.mp3');
const errorDisplay = document.getElementById('error-display');
const errorSound = new Audio('sounds/error.mp3');
const buttonSounds = {
    up: 'sounds/button-up.mp3',
    down: 'sounds/button-down.mp3',
    left: 'sounds/button-left.mp3',
    right: 'sounds/button-right.mp3'
};
const overlay = document.getElementById('overlay');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(err => {
        console.error('Screen orientation lock failed:', err);
    });
}

document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

function playSound(src) {
    const sound = new Audio(src);
    sound.play();
}

document.querySelectorAll('.arrow').forEach(arrow => {
    arrow.addEventListener('click', () => {
        const direction = arrow.id.split('-')[0];
        inputSequence.push(direction);
        updateSequenceDisplay();

        requestAnimationFrame(() => {
            if (!isFinalInputInSequence()) {
                playSound(buttonSounds[direction]);
            }
            checkSequence();
        });
    });
});

function updateSequenceDisplay() {
    sequenceDisplay.innerHTML = '';
    inputSequence.forEach(direction => {
        const img = document.createElement('img');
        img.src = `images/${direction}-arrow.svg`;
        img.alt = direction.charAt(0).toUpperCase() + direction.slice(1);
        sequenceDisplay.appendChild(img);
    });
}

function checkSequence() {
    const matchingStratagem = stratagems.find(stratagem => {
        return stratagem.sequence.every((direction, index) => direction === inputSequence[index]);
    });

    if (matchingStratagem && matchingStratagem.sequence.length === inputSequence.length) {
        displayStratagem(matchingStratagem);
    } else if (matchingStratagem) {
        return;
    } else if (inputSequence.length >= Math.max(...stratagems.map(s => s.sequence.length))) {
        displayError();
    }
}

function displayStratagem(stratagem) {
    logoElement.src = stratagem.logo;
    nameElement.textContent = stratagem.name;
    displayElement.classList.remove('hidden');
    overlay.classList.remove('hidden');
    playSound('sounds/activation.mp3');
    setTimeout(() => {
        displayElement.classList.add('hidden');
        overlay.classList.add('hidden');
        inputSequence = [];
        updateSequenceDisplay();
    }, 3000);
}

function displayError() {
    errorDisplay.classList.remove('hidden');
    overlay.classList.remove('hidden');
    playSound('sounds/error.mp3');
    setTimeout(() => {
        errorDisplay.classList.add('hidden');
        overlay.classList.add('hidden');
        inputSequence = [];
        updateSequenceDisplay();
    }, 1000);
}

function isFinalInputInSequence() {
    const matchingStratagem = stratagems.find(stratagem => {
        return stratagem.sequence.every((direction, index) => direction === inputSequence[index]);
    });

    if (matchingStratagem) {
        return matchingStratagem.sequence.length === inputSequence.length;
    }

    return inputSequence.length >= Math.max(...stratagems.map(s => s.sequence.length));
}