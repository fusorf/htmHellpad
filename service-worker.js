const CACHE_NAME = "htmhellpad-v1";

const PRECACHE_ASSETS = [
    './',
    './index.html',
    './scripts.js',
    './styles.css',
    './lowLag.js',
    './manifest.json',
    './favicon.ico',
    './sm2/js/soundmanager2.js',
    // Sounds
    './sounds/activation.mp3',
    './sounds/error.mp3',
    './sounds/button-up.mp3',
    './sounds/button-down.mp3',
    './sounds/button-left.mp3',
    './sounds/button-right.mp3',
    // Arrow images
    './images/up-arrow.svg',
    './images/down-arrow.svg',
    './images/left-arrow.svg',
    './images/right-arrow.svg',
    // PWA icons
    './images/apple-touch-icon.png',
    './images/favicon-16x16.png',
    './images/favicon-32x32.png',
    './images/icon512_maskable.png',
    './images/icon512_rounded.png',
    './images/android-chrome-192x192.png',
    './images/android-chrome-512x512.png',
    // Stratagem icons
    './images/a_ac_8_autocannon_sentry.svg',
    './images/a_arc_3_tesla_tower.svg',
    './images/a_g_16_gatling_sentry.svg',
    './images/a_m_12_mortar_sentry.svg',
    './images/a_m_23_ems_mortar_sentry.svg',
    './images/a_mg_43_machine_gun_sentry.svg',
    './images/a_mls_4x_rocket_sentry.svg',
    './images/ac_8_autocannon.svg',
    './images/apw_1_anti_materiel_rifle.svg',
    './images/arc_3_arc_thrower.svg',
    './images/ax_ar_23_guard_dog.svg',
    './images/ax_las_5_guard_dog_rover.svg',
    './images/b_1_supply_pack.svg',
    './images/e_mg_101_hmg_emplacement.svg',
    './images/eagle_110mm_rocket_pods.svg',
    './images/eagle_500kg_bomb.svg',
    './images/eagle_airstrike.svg',
    './images/eagle_cluster_bomb.svg',
    './images/eagle_napalm_airstrike.svg',
    './images/eagle_smoke_strike.svg',
    './images/eagle_strafing_run.svg',
    './images/eat_17_expendable_anti_tank.svg',
    './images/faf_14_spear_launcher.svg',
    './images/flam_40_flamethrower.svg',
    './images/fx_12_shield_generator_relay.svg',
    './images/gl_21_grenade_launcher.svg',
    './images/gr_8_recoilless_rifle.svg',
    './images/las_98_laser_cannon.svg',
    './images/las_99_quasar_cannon.svg',
    './images/lift_850_jump_pack.svg',
    './images/m_105_stalwart.svg',
    './images/md_14_incendiary_mines.svg',
    './images/md_6_anti_personnel_minefield.svg',
    './images/mg_206_heavy_machine_gun.svg',
    './images/mg_43_machine_gun.svg',
    './images/orbital_120mm_he_barrage.svg',
    './images/orbital_380mm_he_barrage.svg',
    './images/orbital_airburst_strike.svg',
    './images/orbital_ems_strike.svg',
    './images/orbital_gas_strike.svg',
    './images/orbital_gatling_barrage.svg',
    './images/orbital_laser.svg',
    './images/orbital_precision_strike.svg',
    './images/orbital_railcannon_strike.svg',
    './images/orbital_smoke_strike.svg',
    './images/orbital_walking_barrage.svg',
    './images/rl_77_airburst_rocket_launcher.svg',
    './images/rs_422_railgun.svg',
    './images/sh_20_ballistic_shield_backpack.svg',
    './images/sh_32_shield_generator_pack.svg',
];

// Install: precache all assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch: serve from cache first, fall back to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cached) => cached || fetch(event.request))
    );
});
