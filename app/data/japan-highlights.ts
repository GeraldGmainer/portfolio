import type { RegionId } from '~/data/japan-map'
import type { Localized } from '#shared/types/localized'

// What a highlight jumps to on the map.
export interface MapTarget { place?: string, region?: RegionId, route?: string }

// `images`: the first one is the cover, all of them open in the lightbox.
export const trips: { title: Localized, region: string | Localized, description: Localized, tags: Localized<string[]>, images: string[], map?: MapTarget }[] = [
  {
    title: { de: '21-tägige Fernwanderung in Hokkaido', en: '21-day long-distance hike in Hokkaido' },
    region: 'Hokkaido',
    description: {
      de: 'Eine mehrwöchige Wanderung durch den Norden Japans, meistens im Zelt. Viel unberührte Natur, lange Etappen und zwei überraschende Begegnungen mit Bären auf abgelegenen Bergpfaden.',
      en: 'A hike of several weeks through the north of Japan, mostly sleeping in a tent. Lots of untouched nature, long stages and two surprise encounters with bears on remote mountain trails.'
    },
    tags: { de: ['Fernwanderung', 'Berge', 'Wildlife'], en: ['Long-distance hike', 'Mountains', 'Wildlife'] },
    images: ['/images/japan/hike.jpg'],
    map: { route: 'hokkaido-hike' }
  },
  {
    title: { de: 'Drei Wochen Okinawa und Inselhüpfen', en: 'Three weeks of Okinawa and island hopping' },
    region: 'Okinawa',
    description: {
      de: 'Subtropisches Klima, glasklares Wasser und ein deutlich anderes Tempo als auf den Hauptinseln. Zwischen Schnorcheln, kleinen Häfen und viel Kultur.',
      en: 'A subtropical climate, crystal-clear water and a very different pace from the main islands. Snorkelling, small harbours and a lot of culture.'
    },
    tags: { de: ['Meer', 'Strände', 'Inselhüpfen', 'Subtropen'], en: ['Sea', 'Beaches', 'Island hopping', 'Subtropics'] },
    images: ['/images/japan/okinawa.jpg'],
    map: { region: 'okinawa' }
  },
  {
    title: { de: 'Per Anhalter durch Kyushu', en: 'Hitchhiking through Kyushu' },
    region: 'Kyushu',
    description: {
      de: 'Hitchhiking über Landstraßen, spontane Einladungen zum Essen und unerwartete Umwege. So sind Gespräche entstanden, die es im Schnellzug nie gegeben hätte.',
      en: 'Hitchhiking along country roads, spontaneous invitations to dinner and unexpected detours. Conversations that would never have happened on the bullet train.'
    },
    tags: { de: ['Hitchhiking', 'Onsen', 'Landleben', 'Begegnungen'], en: ['Hitchhiking', 'Onsen', 'Country life', 'Encounters'] },
    images: ['/images/japan/hitchhike.jpg'],
    map: { region: 'kyushu' }
  },
  {
    title: { de: 'Roadtrips mit Auto und Motorrad', en: 'Road trips by car and motorbike' },
    region: 'Honshu · Hokkaido',
    description: {
      de: 'Flexible Routen, abgelegene Küstenstraßen und kleine Pässe im Landesinneren. Praktisch, um Orte zu erreichen, an denen kaum noch Busse fahren.',
      en: 'Flexible routes, remote coastal roads and small mountain passes inland. Handy for reaching places where buses hardly run any more.'
    },
    tags: { de: ['Roadtrip', 'Motorrad', 'Küstenstraßen', 'Flexibilität'], en: ['Road trip', 'Motorbike', 'Coastal roads', 'Freedom'] },
    images: ['/images/japan/bike.jpg']
  },
  {
    title: { de: 'Alltag in Tokio', en: 'Everyday life in Tokyo' },
    region: { de: 'Tokio', en: 'Tokyo' },
    description: {
      de: 'Tokio besteht aus unzähligen Vierteln, und selbst nach Monaten entdeckt man ständig neue Straßen, Orte und Routinen.',
      en: 'Tokyo is made of countless neighbourhoods, and even after months you keep finding new streets, places and routines.'
    },
    tags: { de: ['Stadtleben', 'Bars', 'Nachbarschaften', 'Kultur'], en: ['City life', 'Bars', 'Neighbourhoods', 'Culture'] },
    images: ['/images/japan/cart.jpg'],
    map: { place: 'tokyo' }
  },
  {
    title: { de: 'Städte, Festivals und Kurztrips', en: 'Cities, festivals and short trips' },
    region: { de: 'Tokio · Osaka · Aomori', en: 'Tokyo · Osaka · Aomori' },
    description: {
      de: 'Klassische Highlights, Sommerfeste und kleine Kurztrips – mit vielen Momenten, die man nur erlebt, wenn man länger in der Region unterwegs ist.',
      en: 'Classic sights, summer festivals and short trips – with many moments you only get when you stay in a region for longer.'
    },
    tags: { de: ['Stadtleben', 'Kultur', 'Festivals', 'Food'], en: ['City life', 'Culture', 'Festivals', 'Food'] },
    images: ['/images/japan/fest.jpg']
  },
  {
    title: { de: 'Ramen, Izakaya-Abende und kleine versteckte Restaurants', en: 'Ramen, izakaya evenings and small hidden restaurants' },
    region: 'Japan',
    description: {
      de: 'Gerichte, die spätabends nach langen Tagen doppelt so gut schmecken – von winzigen Ramenläden bis zu Izakayas, in denen man schnell mit Leuten ins Gespräch kommt.',
      en: 'Food that tastes twice as good late at night after a long day – from tiny ramen shops to izakayas where you quickly end up talking to people.'
    },
    tags: { de: ['Food', 'Izakaya', 'Ramen', 'Alltag'], en: ['Food', 'Izakaya', 'Ramen', 'Everyday life'] },
    images: ['/images/japan/food.jpg']
  },
  {
    title: { de: 'Snowboardtage in tiefem Pulverschnee', en: 'Snowboard days in deep powder' },
    region: 'Hokkaido · Nikko',
    description: {
      de: 'Tiefe Powder-Tage, frühe Starts und Abfahrten auf breiten, unberührten Flächen – Winter in seiner besten Form.',
      en: 'Deep powder days, early starts and runs across wide, untouched slopes – winter at its best.'
    },
    tags: { de: ['Winter', 'Snowboard', 'Powder', 'Outdoor'], en: ['Winter', 'Snowboard', 'Powder', 'Outdoors'] },
    images: ['/images/japan/snowboard.jpg']
  },
  {
    title: { de: 'Ruhige Tempel und eindrucksvolle Buddha-Statuen', en: 'Quiet temples and striking Buddha statues' },
    region: 'Kansai · Nara · Kamakura',
    description: {
      de: 'Zwischen alten Tempeln, Räucherstäbchen und großen Buddha-Statuen fühlt sich Japan oft zeitlos an.',
      en: 'Among old temples, incense and great Buddha statues, Japan often feels timeless.'
    },
    tags: { de: ['Kultur', 'Tempel', 'Buddha', 'Tradition'], en: ['Culture', 'Temples', 'Buddha', 'Tradition'] },
    images: ['/images/japan/buddha.jpg'],
    map: { region: 'kansai' }
  }
]

// `place` is an id from app/data/japan-places.ts.
export const moments: { title: Localized, location: Localized, description: Localized, image: string, place?: string }[] = [
  {
    title: { de: 'Tokio bei Nacht', en: 'Tokyo at night' },
    location: { de: 'Tokio', en: 'Tokyo' },
    description: {
      de: 'Neon, kleine Gassen, ruhige Nebenstraßen und volle Bahnhöfe – je später es wird, desto klarer spürt man den Mix aus Tempo und Alltag.',
      en: 'Neon, narrow alleys, quiet side streets and packed stations – the later it gets, the clearer the mix of speed and everyday life.'
    },
    image: '/images/japan/tokyotower.jpg',
    place: 'tokyo'
  },
  {
    title: { de: 'Motorradfahren während der Kirschblütenzeit', en: 'Riding through cherry blossom season' },
    location: { de: 'Honshu', en: 'Honshu' },
    description: {
      de: 'Straßen voller Blüten, milde Temperaturen und die ersten warmen Tage des Jahres – perfekt für entspannte Touren durchs Land.',
      en: 'Roads full of blossoms, mild temperatures and the first warm days of the year – perfect for easy rides through the country.'
    },
    image: '/images/japan/sakura.jpg'
  },
  {
    title: { de: 'Aussichtsplatz am Berg bei Amanohashidate', en: 'Mountain viewpoint above Amanohashidate' },
    location: { de: 'Kyoto Präfektur', en: 'Kyoto Prefecture' },
    description: {
      de: 'Mein Lieblingsspot: stille Morgen, Blick über die Sandbank und ein Ort, an den ich immer wieder zurückgekehrt bin.',
      en: 'My favourite spot: quiet mornings, a view over the sandbar and a place I kept coming back to.'
    },
    image: '/images/japan/amanohashidate.jpg',
    place: 'amanohashidate'
  },
  {
    title: { de: 'Wandern in den Bergen', en: 'Hiking in the mountains' },
    location: { de: 'Nikko', en: 'Nikko' },
    description: {
      de: 'Lange Straßen durch stille Natur und ein Hauch Österreich in der Umgebung – ein Ort, der sofort vertraut wirkt.',
      en: 'Long roads through quiet nature and a touch of Austria in the surroundings – a place that feels familiar at once.'
    },
    image: '/images/japan/nikko.jpg',
    place: 'nikko'
  },
  {
    title: { de: 'Übernachtung im Tempel', en: 'A night in a temple' },
    location: { de: 'Kōya-san · Osaka', en: 'Kōya-san · Osaka' },
    description: {
      de: 'Eine stille Nacht im Tempel auf Kōya-san – Sutren, Nebel und ein Frühstück im Morgengrauen.',
      en: 'A quiet night in a temple on Kōya-san – sutras, mist and breakfast at dawn.'
    },
    image: '/images/japan/koya.jpg',
    place: 'koyasan'
  },
  {
    title: { de: 'Altes Dorf Shirakawago', en: 'The old village of Shirakawago' },
    location: { de: 'Gifu', en: 'Gifu' },
    description: {
      de: 'Traditionelle Gasshō-Häuser, ein stilles Dorfgefühl und eine Atmosphäre, die sich anfühlt wie eine andere Zeit.',
      en: 'Traditional gasshō houses, a quiet village feel and an atmosphere from another time.'
    },
    image: '/images/japan/shirakawago.jpg',
    place: 'shirakawago'
  }
]
