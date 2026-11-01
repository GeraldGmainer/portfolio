// Everything shown on the Japan map. Add a place with its coordinates
// (right-click in Google Maps copies "lat, lng") and the year of the visit;
// the prefecture, its colour and the region are worked out from that.
// Places without `photos` show a placeholder until one is added.
import type { Localized } from '#shared/types/localized'
import { STAGES as HOKKAIDO_HIKE } from './routes/hokkaido-hike'

export interface Place {
  id: string
  /** Romanised names stay as they are; a `{ de, en }` pair only where the name is translated. */
  name: string | Localized
  lat: number
  lng: number
  year: number
  /** Day of arrival, 'YYYY-MM-DD'. */
  date?: string
  /** Route this is a night stop of; the stay lasts until the next stop. */
  route?: string
  note?: Localized
  /** Paths under public/; the first one is the cover. */
  photos?: string[]
}

/** One walking day. Generated from a My Maps export, see scripts/route-from-kml.mjs. */
export interface Stage {
  /** 'YYYY-MM-DD' */
  date: string
  km: number
  /** [lat, lng] along the way. */
  path: [number, number][]
}

export interface Route {
  id: string
  name: string | Localized
  year: number
  /** Where the first stage starts; every stage ends at the route's latest stop. */
  start: string
  note?: Localized
  photos?: string[]
  stages: Stage[]
}

// Validated as a set against the navy surface (dataviz validator: lightness
// band, CVD separation between neighbouring years, 3:1 contrast). Seven hues
// cannot all be told apart pairwise, so the map always pairs colour with the
// year filter, labels and tooltips.
export const YEARS = [
  { year: 2017, color: '#b18e03' },
  { year: 2018, color: '#6d8ced' },
  { year: 2019, color: '#2fab74' },
  { year: 2020, color: '#c965c9' },
  { year: 2021, color: '#899d40' },
  { year: 2022, color: '#2da2bd' },
  { year: 2023, color: '#d77434' }
]

export const PLACES: Place[] = [
  // Hokkaido
  { id: 'hakodate', name: 'Hakodate', lat: 41.7687, lng: 140.7288, year: 2019, photos: ['/images/japan/hakodate-selfie.webp'] },

  // Hokkaido hike: where each walking day ended (end points of the stages).
  { id: 'onuma', name: 'Ōnuma', lat: 41.9839, lng: 140.6735, year: 2019, route: 'hokkaido-hike', date: '2019-08-09', photos: ['/images/japan/onuma-road.webp'] },
  { id: 'higashi-onuma', name: 'Higashi-Ōnuma', lat: 42.0129, lng: 140.7154, year: 2019, route: 'hokkaido-hike', date: '2019-08-10', photos: ['/images/japan/higashi-onuma-lake.webp', '/images/japan/higashi-onuma-rain.webp'] },
  { id: 'mori', name: 'Mori', lat: 42.1031, lng: 140.5773, year: 2019, route: 'hokkaido-hike', date: '2019-08-11', photos: ['/images/japan/mori-swing.webp', '/images/japan/mori-coast-breakfast.webp'] },
  { id: 'otoshibe', name: 'Otoshibe', lat: 42.181, lng: 140.4207, year: 2019, route: 'hokkaido-hike', date: '2019-08-12', photos: ['/images/japan/otoshibe-sea-view.webp', '/images/japan/otoshibe-tent.webp'] },
  { id: 'yakumo', name: 'Yakumo', lat: 42.2574, lng: 140.2541, year: 2019, route: 'hokkaido-hike', date: '2019-08-13', photos: ['/images/japan/yakumo-road.webp'] },
  { id: 'kuroiwa', name: 'Kuroiwa', lat: 42.3702, lng: 140.289, year: 2019, route: 'hokkaido-hike', date: '2019-08-14', photos: ['/images/japan/kuroiwa-cows.webp'] },
  { id: 'oshamambe', name: 'Oshamambe', lat: 42.4898, lng: 140.3574, year: 2019, route: 'hokkaido-hike', date: '2019-08-15', photos: ['/images/japan/oshamambe-room.webp'] },
  { id: 'shizukari', name: 'Shizukari', lat: 42.5897, lng: 140.4681, year: 2019, route: 'hokkaido-hike', date: '2019-08-17', photos: ['/images/japan/shizukari-tent.webp'] },
  { id: 'rebunge', name: 'Rebunge', lat: 42.5743, lng: 140.5919, year: 2019, route: 'hokkaido-hike', date: '2019-08-18', photos: ['/images/japan/rebunge-tent.webp', '/images/japan/rebunge-cliff-road.webp'] },
  { id: 'toyoura', name: 'Toyoura', lat: 42.5813, lng: 140.7204, year: 2019, route: 'hokkaido-hike', date: '2019-08-19', photos: ['/images/japan/toyoura-rest.webp'] },
  { id: 'toya', name: { de: 'Tōya-See', en: 'Lake Tōya' }, lat: 42.5921, lng: 140.7915, year: 2019, route: 'hokkaido-hike', date: '2019-08-20', photos: ['/images/japan/toya-lake-view.webp', '/images/japan/toya-road.webp', '/images/japan/toya-pagoda.webp'] },
  { id: 'rusutsu', name: 'Rusutsu', lat: 42.6969, lng: 140.8364, year: 2019, route: 'hokkaido-hike', date: '2019-08-21', photos: ['/images/japan/rusutsu-pizza.webp'] },
  { id: 'makkari', name: 'Makkari', lat: 42.7683, lng: 140.8005, year: 2019, route: 'hokkaido-hike', date: '2019-08-22', photos: ['/images/japan/makkari-tent.webp', '/images/japan/makkari-rain.webp'] },
  { id: 'hirafu', name: 'Niseko-Hirafu', lat: 42.8521, lng: 140.7029, year: 2019, route: 'hokkaido-hike', date: '2019-08-23', photos: ['/images/japan/hirafu-yotei.webp', '/images/japan/hirafu-street.webp'] },
  { id: 'kutchan', name: 'Kutchan', lat: 42.9004, lng: 140.7754, year: 2019, route: 'hokkaido-hike', date: '2019-08-26', photos: ['/images/japan/kutchan-yotei.webp', '/images/japan/kutchan-tent.webp'] },
  { id: 'akaigawa', name: 'Akaigawa', lat: 43.083, lng: 140.8118, year: 2019, route: 'hokkaido-hike', date: '2019-08-27', photos: ['/images/japan/akaigawa-tent.webp', '/images/japan/akaigawa-shelter.webp', '/images/japan/akaigawa-ice-cream.webp'] },
  { id: 'yoichi', name: 'Yoichi', lat: 43.1929, lng: 140.817, year: 2019, route: 'hokkaido-hike', date: '2019-08-29', photos: ['/images/japan/yoichi-playground-tent.webp'] },
  { id: 'otaru', name: 'Otaru', lat: 43.1927, lng: 141.0042, year: 2019, route: 'hokkaido-hike', date: '2019-08-30', photos: ['/images/japan/otaru-bay.webp', '/images/japan/otaru-city-view.webp'] },
  { id: 'zenibako', name: 'Zenibako', lat: 43.1365, lng: 141.1897, year: 2019, route: 'hokkaido-hike', date: '2019-09-02', photos: ['/images/japan/zenibako-tent.webp'] },
  { id: 'sapporo', name: 'Sapporo', lat: 43.068, lng: 141.3509, year: 2019, route: 'hokkaido-hike', date: '2019-09-03', photos: ['/images/japan/food.jpg', '/images/japan/sapporo-station.webp'] },

  // Tohoku
  { id: 'aomori', name: 'Aomori', lat: 40.8222, lng: 140.7474, year: 2019, photos: ['/images/japan/fest.jpg', '/images/japan/aomori-aspam.webp', '/images/japan/aomori-nebuta.webp'] },
  { id: 'hirosaki', name: 'Hirosaki', lat: 40.6031, lng: 140.4641, year: 2020 },
  { id: 'kurosaki', name: 'Kurosaki Camping', lat: 39.992, lng: 141.932, year: 2019, photos: ['/images/japan/kurosaki-camp.webp'] },
  { id: 'morioka', name: 'Morioka', lat: 39.7036, lng: 141.1527, year: 2019, photos: ['/images/japan/morioka-castle-park.webp'] },
  { id: 'ofunato', name: 'Ofunato', lat: 39.0819, lng: 141.7085, year: 2020 },
  { id: 'namahage', name: 'Namahage Camping', lat: 39.94, lng: 139.78, year: 2021 },
  { id: 'akita', name: 'Akita', lat: 39.72, lng: 140.1025, year: 2021 },
  { id: 'daisen', name: 'Daisen', lat: 39.453, lng: 140.4755, year: 2021 },
  { id: 'yokote', name: 'Yokote', lat: 39.3113, lng: 140.5534, year: 2021 },
  { id: 'shinjo', name: 'Shinjo', lat: 38.765, lng: 140.3016, year: 2020 },
  { id: 'shirataka', name: 'Shirataka Camping', lat: 38.18, lng: 140.1, year: 2020 },
  { id: 'miyagi-camping', name: { de: 'Camping bei Sendai', en: 'Camping near Sendai' }, lat: 38.33, lng: 140.97, year: 2019, photos: ['/images/japan/miyagi-camping-car.webp'] },
  { id: 'matsushima', name: 'Matsushima', lat: 38.3725, lng: 141.0617, year: 2020 },
  { id: 'sendai', name: 'Sendai', lat: 38.2682, lng: 140.8694, year: 2020 },
  { id: 'aizu', name: 'Aizu-Wakamatsu', lat: 37.4948, lng: 139.9298, year: 2020 },
  { id: 'bandai', name: 'Bandai-san', lat: 37.6006, lng: 140.0733, year: 2019, photos: ['/images/japan/bandai-urabandai-lake.webp'] },
  { id: 'inawashiro', name: 'Inawashiro', lat: 37.5583, lng: 140.1044, year: 2019, photos: ['/images/japan/inawashiro-viaduct-field.webp'] },
  { id: 'showa', name: 'Showa Camp', lat: 37.33, lng: 139.61, year: 2019 },
  { id: 'iwaki', name: 'Iwaki', lat: 37.0505, lng: 140.8877, year: 2019, photos: ['/images/japan/iwaki-motorbike-view.webp'] },

  // Kanto
  { id: 'nikko', name: 'Nikko', lat: 36.7199, lng: 139.6982, year: 2017, note: { de: 'Lange Straßen durch stille Natur und ein Hauch Österreich in der Umgebung.', en: 'Long roads through quiet nature and a touch of Austria in the surroundings.' }, photos: ['/images/japan/nikko.jpg', '/images/japan/nikko-shrine-gate.webp'] },
  { id: 'chuzenji', name: { de: 'Chuzenji-See', en: 'Lake Chuzenji' }, lat: 36.7375, lng: 139.487, year: 2017, photos: ['/images/japan/chuzenji-torii.webp'] },
  { id: 'utsunomiya', name: 'Utsunomiya', lat: 36.5551, lng: 139.8828, year: 2017, photos: ['/images/japan/utsunomiya-shinkansen.webp'] },
  { id: 'fukuroda', name: { de: 'Fukuroda-Fälle', en: 'Fukuroda Falls' }, lat: 36.7653, lng: 140.4072, year: 2019, photos: ['/images/japan/fukuroda-falls.webp'] },
  { id: 'tsukuba', name: 'Tsukuba-san', lat: 36.2253, lng: 140.1067, year: 2019 },
  { id: 'tsuchiura', name: 'Tsuchiura', lat: 36.0785, lng: 140.2045, year: 2019 },
  { id: 'ushiku', name: 'Ushiku', lat: 35.9794, lng: 140.1496, year: 2019, photos: ['/images/japan/buddha.jpg'] },
  { id: 'kusatsu-onsen', name: 'Kusatsu Onsen', lat: 36.6206, lng: 138.5962, year: 2021 },
  { id: 'haruna', name: 'Haruna-san', lat: 36.4772, lng: 138.8517, year: 2019, photos: ['/images/japan/haruna-camp-night.webp', '/images/japan/haruna-camp-bike.webp', '/images/japan/haruna-road-bike.webp', '/images/japan/haruna-lake-bike.webp'] },
  { id: 'isesaki', name: 'Isesaki', lat: 36.3114, lng: 139.1968, year: 2019 },
  { id: 'ageo', name: 'Ageo', lat: 35.9775, lng: 139.5933, year: 2019 },
  { id: 'kawaguchi', name: 'Kawaguchi', lat: 35.8077, lng: 139.724, year: 2019 },
  { id: 'tokyo', name: { de: 'Tokio', en: 'Tokyo' }, lat: 35.6812, lng: 139.7671, year: 2017, note: { de: 'Neon, kleine Gassen, ruhige Nebenstraßen und volle Bahnhöfe.', en: 'Neon, narrow alleys, quiet side streets and packed stations.' }, photos: ['/images/japan/tokyotower.jpg', '/images/japan/cart.jpg', '/images/japan/tokyo-gundam.webp', '/images/japan/tokyo-maid-cafe.webp', '/images/japan/tokyo-bay-flight.webp'] },
  { id: 'yokohama', name: 'Yokohama', lat: 35.4437, lng: 139.638, year: 2017, photos: ['/images/japan/yokohama-oktoberfest.webp'] },
  { id: 'kamakura', name: 'Kamakura', lat: 35.3192, lng: 139.5467, year: 2017, photos: ['/images/japan/kamakura-great-buddha.webp'] },
  { id: 'enoshima', name: 'Enoshima', lat: 35.2999, lng: 139.4803, year: 2017, photos: ['/images/japan/enoshima-bridge.webp'] },
  { id: 'odawara', name: 'Odawara', lat: 35.2648, lng: 139.1522, year: 2019, photos: ['/images/japan/odawara-castle.webp'] },
  { id: 'hakone', name: 'Hakone', lat: 35.2324, lng: 139.1069, year: 2019 },
  { id: 'narita', name: 'Narita', lat: 35.7767, lng: 140.3184, year: 2018, photos: ['/images/japan/narita-omotesando.webp'] },
  { id: 'chiba', name: 'Chiba', lat: 35.6074, lng: 140.1065, year: 2018, photos: ['/images/japan/chiba-rainy-day.webp'] },

  // Chubu
  { id: 'niigata', name: 'Niigata', lat: 37.9161, lng: 139.0364, year: 2019, photos: ['/images/japan/niigata-coast-road.webp', '/images/japan/niigata-viaduct-bike.webp'] },
  { id: 'agano', name: 'Agano Camping', lat: 37.83, lng: 139.23, year: 2020 },
  { id: 'oumigawa', name: 'Oumigawa Camping', lat: 37.345, lng: 138.627, year: 2019, photos: ['/images/japan/oumigawa-bike-selfie.webp'] },
  { id: 'minamiuonuma', name: 'Minamiuonuma', lat: 37.0656, lng: 138.876, year: 2019, photos: ['/images/japan/minamiuonuma-tent.webp'] },
  { id: 'nagano', name: 'Nagano', lat: 36.6485, lng: 138.195, year: 2020 },
  { id: 'karuizawa', name: 'Karuizawa', lat: 36.3484, lng: 138.597, year: 2021 },
  { id: 'matsumoto', name: 'Matsumoto', lat: 36.238, lng: 137.972, year: 2019, photos: ['/images/japan/matsumoto-castle.webp'] },
  { id: 'sakurashimizu', name: 'Sakurashimizu Camping', lat: 36.2, lng: 138.15, year: 2019, photos: ['/images/japan/sakurashimizu-camp.webp', '/images/japan/sakurashimizu-road.webp'] },
  { id: 'kawaguchiko', name: 'Kawaguchiko', lat: 35.5009, lng: 138.7552, year: 2019 },
  { id: 'saiko', name: { de: 'Saiko-See', en: 'Lake Saiko' }, lat: 35.4979, lng: 138.688, year: 2019, photos: ['/images/japan/saiko-tent.webp'] },
  { id: 'tanuki', name: { de: 'Tanuki-See', en: 'Lake Tanuki' }, lat: 35.3433, lng: 138.5592, year: 2019, photos: ['/images/japan/tanuki-fuji-view.webp'] },
  { id: 'gotemba', name: 'Gotemba', lat: 35.3087, lng: 138.9347, year: 2019, photos: ['/images/japan/gotemba-harley.webp'] },
  { id: 'shizuoka', name: 'Shizuoka', lat: 34.9756, lng: 138.3828, year: 2023 },
  { id: 'ito', name: 'Ito', lat: 34.9659, lng: 139.102, year: 2019, photos: ['/images/japan/ito-motorbike.webp'] },
  { id: 'shirahama', name: 'Shirahama (Izu)', lat: 34.6926, lng: 138.9757, year: 2019, photos: ['/images/japan/shirahama-coast-ride.webp'] },
  { id: 'suzu', name: 'Aerial Observatory', lat: 37.514, lng: 137.332, year: 2020 },
  { id: 'wajima', name: 'Wajima', lat: 37.3906, lng: 136.899, year: 2020 },
  { id: 'kanazawa', name: 'Kanazawa', lat: 36.5613, lng: 136.6562, year: 2020 },
  { id: 'toyama', name: 'Toyama', lat: 36.6953, lng: 137.2113, year: 2020 },
  { id: 'takaoka', name: 'Takaoka', lat: 36.7541, lng: 137.0257, year: 2020 },
  { id: 'takayama', name: 'Takayama', lat: 36.1461, lng: 137.2522, year: 2020 },
  { id: 'shirakawago', name: 'Shirakawago', lat: 36.2578, lng: 136.9061, year: 2020, note: { de: 'Traditionelle Gasshō-Häuser und ein Dorfgefühl wie aus einer anderen Zeit.', en: 'Traditional gasshō houses and a village feel from another time.' }, photos: ['/images/japan/shirakawago.jpg'] },
  { id: 'hashima', name: 'Hashima', lat: 35.3199, lng: 136.7033, year: 2020 },
  { id: 'fukui', name: 'Fukui', lat: 36.0641, lng: 136.2196, year: 2022 },
  { id: 'ayukawa', name: 'Ayukawa Onchi Camping', lat: 36.1, lng: 136.04, year: 2022 },
  { id: 'nagoya', name: 'Nagoya', lat: 35.1815, lng: 136.9066, year: 2017, photos: ['/images/japan/nagoya-dai-nagoya-building.webp'] },
  { id: 'toyohashi', name: 'Toyohashi', lat: 34.7692, lng: 137.3915, year: 2022 },

  // Kansai
  { id: 'kusatsu-shiga', name: 'Kusatsu (Shiga)', lat: 35.013, lng: 135.9599, year: 2022 },
  { id: 'iga', name: 'Iga-Ueno', lat: 34.7686, lng: 136.13, year: 2022 },
  { id: 'ise', name: 'Ise', lat: 34.4875, lng: 136.7095, year: 2022 },
  { id: 'iseshima', name: 'Ise-Shima', lat: 34.38, lng: 136.8, year: 2022 },
  { id: 'amanohashidate', name: 'Amanohashidate', lat: 35.5696, lng: 135.191, year: 2017, note: { de: 'Mein Lieblingsspot: stille Morgen und Blick über die Sandbank.', en: 'My favourite spot: quiet mornings and a view over the sandbar.' }, photos: ['/images/japan/amanohashidate.jpg'] },
  { id: 'maizuru', name: 'Maizuru', lat: 35.4747, lng: 135.386, year: 2023 },
  { id: 'kyoto', name: 'Kyoto', lat: 35.0116, lng: 135.7681, year: 2017, photos: ['/images/japan/kyoto-kinkakuji.webp', '/images/japan/kyoto-fushimi-inari.webp', '/images/japan/kyoto-samurai-show.webp'] },
  { id: 'toyooka', name: 'Toyooka', lat: 35.5446, lng: 134.82, year: 2023 },
  { id: 'himeji', name: 'Himeji', lat: 34.8394, lng: 134.6939, year: 2017, photos: ['/images/japan/himeji-castle.webp'] },
  { id: 'osaka', name: 'Osaka', lat: 34.6937, lng: 135.5023, year: 2017, photos: ['/images/japan/osaka-castle.webp', '/images/japan/osaka-dotonbori.webp', '/images/japan/osaka-tsutenkaku.webp'] },
  { id: 'nara', name: 'Nara', lat: 34.6851, lng: 135.8048, year: 2017, photos: ['/images/japan/nara-todaiji.webp'] },
  { id: 'koyasan', name: 'Kōya-san', lat: 34.213, lng: 135.5866, year: 2017, note: { de: 'Eine stille Nacht im Tempel: Sutren, Nebel und Frühstück im Morgengrauen.', en: 'A quiet night in a temple: sutras, mist and breakfast at dawn.' }, photos: ['/images/japan/koya.jpg', '/images/japan/koyasan-temple-meal.webp'] },

  // Chugoku
  { id: 'tottori', name: 'Tottori', lat: 35.5011, lng: 134.2351, year: 2023 },
  { id: 'matsue', name: 'Matsue', lat: 35.4723, lng: 133.0505, year: 2023 },
  { id: 'izumo', name: 'Izumo', lat: 35.367, lng: 132.7547, year: 2023 },
  { id: 'okayama', name: 'Okayama', lat: 34.6551, lng: 133.9195, year: 2023 },
  { id: 'hiroshima', name: 'Hiroshima', lat: 34.3853, lng: 132.4553, year: 2017, photos: ['/images/japan/hiroshima-dome.webp'] },
  { id: 'miyajima', name: 'Miyajima', lat: 34.2959, lng: 132.3198, year: 2017, photos: ['/images/japan/miyajima-torii.webp'] },
  { id: 'rakan', name: 'Rakan Camping', lat: 34.31, lng: 132.06, year: 2023 },

  // Shikoku
  { id: 'takamatsu', name: 'Takamatsu', lat: 34.3428, lng: 134.0466, year: 2023 },
  { id: 'miroku', name: 'Miroku Camping', lat: 34.26, lng: 134.17, year: 2023 },
  { id: 'taiyo', name: 'Taiyo Camping', lat: 33.75, lng: 134.6, year: 2023 },
  { id: 'matsuyama', name: 'Matsuyama', lat: 33.8392, lng: 132.7657, year: 2023 },
  { id: 'kochi', name: 'Kochi', lat: 33.5597, lng: 133.5311, year: 2023 },
  { id: 'shimanto', name: 'Shimanto', lat: 32.9917, lng: 132.9339, year: 2023 },

  // Kyushu
  { id: 'fukuoka', name: 'Fukuoka', lat: 33.5902, lng: 130.4017, year: 2019, photos: ['/images/japan/fukuoka-hitchhike-to-saga.webp', '/images/japan/fukuoka-club-night.webp', '/images/japan/fukuoka-driver-selfie.webp'] },
  { id: 'beppu', name: 'Beppu', lat: 33.2846, lng: 131.4914, year: 2019, photos: ['/images/japan/beppu-hitchhike-to-fukuoka.webp'] },
  { id: 'saga', name: 'Saga', lat: 33.2635, lng: 130.3009, year: 2019, photos: ['/images/japan/saga-hitchhike-to-nagasaki.webp'] },
  { id: 'nagasaki', name: 'Nagasaki', lat: 32.7503, lng: 129.8779, year: 2019, photos: ['/images/japan/hitchhike.jpg', '/images/japan/nagasaki-night-view.webp', '/images/japan/nagasaki-hitchhike-1.webp', '/images/japan/nagasaki-hitchhike-2.webp'] },
  { id: 'kumamoto', name: 'Kumamoto', lat: 32.8032, lng: 130.7079, year: 2019, photos: ['/images/japan/kumamoto-river-sunset.webp', '/images/japan/kumamoto-hitchhike-1.webp', '/images/japan/kumamoto-hitchhike-2.webp', '/images/japan/kumamoto-hitchhike-3.webp'] },
  { id: 'miyazaki', name: 'Miyazaki', lat: 31.9077, lng: 131.4202, year: 2019, photos: ['/images/japan/miyazaki-hitchhike-to-beppu.webp', '/images/japan/miyazaki-arrival.webp'] },
  { id: 'kagoshima', name: 'Kagoshima', lat: 31.5966, lng: 130.5571, year: 2019, photos: ['/images/japan/kagoshima-sakurajima-view.webp', '/images/japan/kagoshima-lava-coast.webp', '/images/japan/kagoshima-hitchhike-to-miyazaki.webp'] },

  // Okinawa
  { id: 'nago', name: 'Nago', lat: 26.5917, lng: 127.9775, year: 2018, photos: ['/images/japan/nago-churaumi-aquarium.webp', '/images/japan/nago-coast-road.webp', '/images/japan/nago-jungle-path.webp'] },
  { id: 'onna', name: 'Onna-son', lat: 26.4975, lng: 127.8536, year: 2018, photos: ['/images/japan/onna-cape-manzamo.webp'] },
  { id: 'naha', name: 'Naha', lat: 26.2124, lng: 127.6809, year: 2018, photos: ['/images/japan/naha-shuri-castle.webp'] },
  { id: 'ishigaki', name: 'Ishigaki-jima', lat: 24.3448, lng: 124.1572, year: 2018, photos: ['/images/japan/okinawa.jpg'] },
  { id: 'taketomi', name: 'Taketomi-jima', lat: 24.3286, lng: 124.0889, year: 2018, photos: ['/images/japan/taketomi-village.webp'] }
]

export const ROUTES: Route[] = [
  {
    id: 'hokkaido-hike',
    name: { de: 'Fernwanderung durch Hokkaido', en: 'Long-distance hike across Hokkaido' },
    year: 2019,
    start: 'Nanae',
    photos: ['/images/japan/hike.jpg'],
    stages: HOKKAIDO_HIKE
  }
]
