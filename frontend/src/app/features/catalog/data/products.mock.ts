import { ProductCardItem } from '../components/product-card/product-card';

const musicCategory = {
  id: 1,
  name: 'Música',
  slug: 'musica',
  isActive: true
};

export const productsMock: ProductCardItem[] = [
  {
    id: 1,
    name: 'From Mars To Sirius',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Gojira',
      format: 'vinyl',
      genre: 'Progressive Metal',
      releaseYear: 2022,
      releaseDate: '2005-09-27',
      vinylColor: { name: 'Blanco crema', hex: '#e8e5d8' },
      label: 'Listenable Records',
      discCount: 2,
      condition: 'new'
    },
    price: 105000,
    description: 'Edición en vinilo del clásico álbum de Gojira, con sonido progresivo y atmósfera intensa.',
    stock: 1,
    images: [
      'https://f4.bcbits.com/img/0042534543_10.jpg',
      'https://f4.bcbits.com/img/0013928875_10.jpg'
    ],
    isActive: true,
    isNew: true
  },
  {
    id: 2,
    name: 'Slaughter of the Soul',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'At The Gates',
      vinylColor: { name: 'Naranja', hex: '#c77716' },
      format: 'vinyl',
      genre: 'Melodic Death Metal',
      releaseYear: 2023,
      releaseDate: '1995-11-14',
      label: 'Earache Records',
      discCount: 1,
      condition: 'new'
    },
    price: 95000,
    description: 'Obra esencial del death metal melódico sueco, disponible en una edición de vinilo para coleccionistas. Sus guitarras precisas, cambios dinámicos y melodías memorables marcaron una época dentro del género. El formato físico permite disfrutar cada detalle de un álbum imprescindible para una colección de metal extremo.',
    stock: 2,
    images: [
      'https://f4.bcbits.com/img/0037369395_10.jpg',
      'https://f4.bcbits.com/img/a2024836109_5.jpg',
      'https://f4.bcbits.com/img/0008114998_10.jpg'
    ],
    isActive: true,
    isNew: true
  },
  {
    id: 3,
    name: 'The Way of All Flesh',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Gojira',
      format: 'vinyl',
      genre: 'Progressive Metal',
      releaseYear: 2018,
      releaseDate: '2008-10-13',
      vinylColor: { name: 'Azul', hex: '#2450dc' },
      label: 'Listenable Records',
      discCount: 2,
      condition: 'new'
    },
    price: 110000,
    description: 'The Way of All Flesh reúne la contundencia del death metal con la exploración rítmica y las atmósferas que distinguen a Gojira. Las guitarras alternan riffs densos, armónicos y patrones de gran precisión, mientras la batería construye una base cambiante que mantiene la tensión incluso en los pasajes más pausados. La voz aporta un carácter intenso a una propuesta que combina fuerza, sensibilidad y una mirada reflexiva sobre la existencia. A lo largo del álbum, las composiciones transitan entre explosiones de energía y momentos de introspección, con transiciones que invitan a escuchar cada tema como parte de un recorrido completo. Canciones como Oroborus, Toxic Garbage Island y The Art of Dying muestran distintas facetas del grupo: desde el impacto inmediato de sus riffs hasta desarrollos extensos en los que el ritmo y la repetición adquieren un papel central. Sus letras exploran la mortalidad, la relación del ser humano con su entorno y el paso del tiempo, acompañando una música que resulta tan física como contemplativa. El formato de dos discos permite disfrutar la obra con pausas entre sus caras y dedicar atención a los detalles de los arreglos, las texturas y los contrastes. La presentación visual completa una edición para quienes disfrutan el ritual de escuchar un álbum de principio a fin y conservarlo como parte de su colección. Una opción para seguidores de Gojira y para quienes buscan acercarse a un metal progresivo pesado, atmosférico y lleno de matices.',
    stock: 3,
    images: [
      'https://f4.bcbits.com/img/0040270533_10.jpg',
      'https://f4.bcbits.com/img/0013928710_10.jpg'
    ],
    isActive: true,
    isNew: true
  },
  {
    id: 4,
    name: 'Fallen Angel Of Doom',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Blasphemy',
      vinylColor: { name: 'Negro', hex: '#111111' },
      format: 'vinyl',
      genre: 'War Metal',
      releaseYear: 2015,
      releaseDate: '1990-10-01',
      label: 'Wild Rags Records',
      discCount: 1,
      condition: 'new'
    },
    price: 90000,
    description: 'Pieza fundamental del war metal canadiense, presentada en formato vinilo para una colección extrema. La grabación ofrece una descarga directa de riffs veloces, baterías agresivas y una estética cruda que define el sonido de la banda. Una referencia de culto para quienes exploran las raíces más feroces del metal underground.',
    stock: 1,
    images: [
      'https://f4.bcbits.com/img/0047466366_10.jpg',
      'https://f4.bcbits.com/img/a0064561049_5.jpg'
    ],
    isActive: true,
    isNew: false
  },
  {
    id: 5,
    name: 'Pro Xristou',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Rotting Christ',
      vinylColor: { name: 'Negro', hex: '#111111' },
      format: 'vinyl',
      genre: 'Black Metal',
      releaseYear: 2024,
      releaseDate: '2024-05-24',
      label: 'Season of Mist',
      discCount: 1,
      condition: 'new'
    },
    price: 115000,
    description: 'Lanzamiento reciente de Rotting Christ con una propuesta oscura, épica y profundamente melódica. Sus arreglos combinan coros solemnes, guitarras envolventes y una narrativa inspirada en mitos y símbolos antiguos. Una edición pensada para seguidores de larga trayectoria y para quienes quieren descubrir la faceta más ceremonial del grupo.',
    stock: 2,
    images: [
      'https://f4.bcbits.com/img/0035139854_10.jpg',
      'https://f4.bcbits.com/img/0035139793_10.jpg'
    ],
    isActive: true,
    isNew: false
  },
  {
    id: 6,
    name: 'Left Hand Path',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Entombed',
      vinylColor: { name: 'Negro', hex: '#111111' },
      vinylColors: [
        { name: 'Negro', hex: '#111111', imageIndex: 0 },
        { name: 'Azul marmoleado', hex: '#537cc9', imageIndex: 1 },
        { name: 'Amarillo dorado', hex: '#b4a132', imageIndex: 2 }
      ],
      format: 'vinyl',
      genre: 'Death Metal',
      releaseYear: 2021,
      releaseDate: '1990-06-04',
      label: 'Earache Records',
      discCount: 1,
      condition: 'new'
    },
    price: 95000,
    description: 'Clásico del death metal sueco, reconocido por sus guitarras densas y su sonido crudo e influyente. La producción conserva la energía de una escena que transformó el metal extremo y convirtió estos riffs en una referencia internacional. Su escucha recompensa tanto a los coleccionistas veteranos como a quienes se acercan por primera vez al género.',
    stock: 3,
    images: [
      'https://f4.bcbits.com/img/0031611650_10.jpg',
      'https://f4.bcbits.com/img/0042673750_10.jpg',
      'https://f4.bcbits.com/img/0027919700_10.jpg'
    ],
    isActive: true,
    isNew: false
  },
  {
    id: 7,
    name: 'Melissa',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Mercyful Fate',
      format: 'vinyl',
      genre: 'Heavy Metal',
      releaseYear: 2016,
      releaseDate: '1983-10-30',
      vinylColor: { name: 'Negro', hex: '#111111' },
      label: 'Roadrunner Records',
      discCount: 1,
      condition: 'new'
    },
    price: 100000,
    description: 'Debut histórico de Mercyful Fate, una referencia del heavy metal oscuro y teatral de los años ochenta. Las guitarras gemelas, las voces dramáticas y las composiciones llenas de tensión construyen una identidad única en cada surco. Un álbum esencial para entender la evolución del metal clásico y una incorporación con mucha personalidad para cualquier colección.',
    stock: 1,
    images: [
      'https://f4.bcbits.com/img/0041204342_10.jpg',
      'https://f4.bcbits.com/img/a1613378443_5.jpg'
    ],
    isActive: true,
    isNew: false
  },
  {
    id: 8,
    name: 'Necroticism – Descanting the Insalubrious',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Carcass',
      vinylColor: { name: 'Verde', hex: '#009447' },
      vinylColors: [
        { name: 'Verde', hex: '#009447', imageIndex: 0 },
        { name: 'Blanco', hex: '#ffffff', imageIndex: 1 },
        { name: 'Morado', hex: '#8b299e', imageIndex: 2 },
        { name: 'Negro con rojo splatter', hex: '#111111', secondaryHex: '#c92835', imageIndex: 3 }
      ],
      format: 'vinyl',
      genre: 'Death Metal',
      releaseYear: 2019,
      releaseDate: '1991-10-01',
      label: 'Earache Records',
      discCount: 1,
      condition: 'new'
    },
    price: 110000,
    description: 'Álbum esencial de Carcass, donde el death metal y el grindcore se encuentran con composiciones complejas. Sus arreglos quirúrgicos, cambios inesperados y texturas contundentes revelan una banda en plena evolución creativa. Esta edición es especialmente atractiva para quienes valoran los discos extremos con gran riqueza instrumental y una historia propia dentro del género.',
    stock: 2,
    images: [
      'https://f4.bcbits.com/img/0046581314_10.jpg',
      'https://f4.bcbits.com/img/0041935587_10.jpg',
      'https://f4.bcbits.com/img/0024791282_10.jpg',
      'https://f4.bcbits.com/img/0042673716_10.jpg'
    ],
    isActive: true,
    isNew: false
  },
  {
    id: 9,
    name: "Don't Break the Oath",
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Mercyful Fate',
      format: 'vinyl',
      genre: 'Heavy Metal',
      releaseYear: 2017,
      releaseDate: '1984-09-07',
      vinylColor: { name: 'Rojo', hex: '#e51624' },
      label: 'Roadrunner Records',
      discCount: 1,
      condition: 'new'
    },
    price: 100000,
    description: 'Clásico de Mercyful Fate con una identidad oscura, riffs memorables y una interpretación vocal inconfundible. El álbum alterna pasajes atmosféricos con momentos de gran intensidad, manteniendo una tensión teatral que sigue sonando vigente. Su presencia en formato vinilo aporta un punto especial a una colección dedicada al heavy metal de los ochenta.',
    stock: 3,
    images: [
      'https://f4.bcbits.com/img/0041204391_10.jpg',
      'https://f4.bcbits.com/img/a0621509914_5.jpg'
    ],
    isActive: true,
    isNew: false
  },
  {
    id: 10,
    name: 'In Dark Purity (Orange Smoke Vinyl) 12"',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Monstrosity',
      vinylColor: { name: 'Naranja humo', hex: '#c77716' },
      format: 'vinyl',
      genre: 'Death Metal',
      label: 'Metal Blade Records',
      discCount: 1,
      condition: 'new'
    },
    price: 89000,
    description: 'Edición en vinilo Orange Smoke de In Dark Purity, disponible en preventa. Su acabado translúcido aporta una presentación llamativa y convierte cada copia en una pieza atractiva para exhibir junto a la colección. El lanzamiento conserva la contundencia del death metal de Monstrosity y está pensado para quienes disfrutan descubrir nuevas ediciones antes de su llegada general.',
    stock: 1,
    images: [
      'https://metalblade.indiemerch.com/cdn/shop/files/46f010a47cfd2155cda4fc48cf4f9c2f_550x.jpg?v=1791219406'
    ],
    isActive: true,
    isNew: true
  },
  {
    id: 11,
    name: 'Earth A.D.',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Misfits',
      format: 'vinyl',
      genre: 'Horror Punk',
      releaseYear: 2023,
      label: 'Plan 9 Records',
      vinylColor: { name: 'Negro', hex: '#111111' },
      discCount: 1,
      condition: 'new'
    },
    price: 155000,
    description: 'Edición en vinilo de Earth A.D., clásico del horror punk de Misfits. Sus canciones breves y explosivas combinan actitud punk, atmósferas oscuras y una energía que convirtió al álbum en una pieza fundamental de la escena alternativa. Una elección perfecta para ampliar una colección con un título influyente, directo y lleno de personalidad.',
    stock: 2,
    images: [
      'https://bomberstore.com/2902-large_default/misfits-earth-ad-vinilo.jpg'
    ],
    isActive: true,
    isNew: false
  },
  {
    id: 12,
    name: 'Next to Die (Marble Vinyl)',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Six Feet Under',
      vinylColor: { name: 'Azul marmoleado', hex: '#648b96' },
      format: 'vinyl',
      genre: 'Death Metal',
      label: 'Listenable Records',
      discCount: 1,
      condition: 'new'
    },
    price: 87000,
    description: 'Edición en vinilo marmoleado de Next to Die, de Six Feet Under. El acabado visual del disco acompaña una propuesta pesada y directa, con guitarras graves, baterías contundentes y una interpretación vocal característica. Es una edición especial para quienes buscan sumar una pieza llamativa y actual a su colección de death metal.',
    stock: 3,
    images: [
      'https://shop-listenable.net/24930-large_default/six-feet-under-next-to-die-lp-marble-vinyl.jpg'
    ],
    isActive: true,
    isNew: true
  },
  {
    id: 13,
    name: 'The Ten Commandments (Black Yellow Splatter Vinyl)',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Malevolent Creation',
      vinylColor: { name: 'Negro y amarillo splatter', hex: '#e5d73c' },
      format: 'vinyl',
      genre: 'Death Metal',
      label: 'Listenable Records',
      discCount: 1,
      condition: 'new'
    },
    price: 104000,
    description: 'Edición limitada en vinilo Black Yellow Splatter de The Ten Commandments, de Malevolent Creation. El diseño de salpicaduras en negro y amarillo hace que cada copia tenga una apariencia distintiva, mientras la música conserva la intensidad de uno de los títulos fundamentales del death metal estadounidense. Una pieza de colección que combina valor visual, historia y una escucha poderosa.',
    stock: 1,
    images: [
      'https://shop-listenable.net/24848-large_default/malevolent-creation-the-ten-commandments-limited-edition-black-yellow-splatter-vinyl.jpg'
    ],
    isActive: true,
    isNew: true
  },
  {
    id: 14,
    name: 'Retribution (Black Red Splatter Vinyl)',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Malevolent Creation',
      vinylColor: { name: 'Negro y rojo splatter', hex: '#c92835' },
      format: 'vinyl',
      genre: 'Death Metal',
      label: 'Listenable Records',
      discCount: 1,
      condition: 'new'
    },
    price: 119000,
    description: 'Edición limitada en vinilo Black Red Splatter de Retribution, de Malevolent Creation. La combinación de colores refuerza la estética agresiva del álbum y aporta una presencia especial al momento de exhibirlo. En sus surcos se encuentra una interpretación técnica y veloz, ideal para seguidores del death metal clásico que buscan una edición diferente.',
    stock: 2,
    images: [
      'https://shop-listenable.net/24846-large_default/malevolent-creation-retribution-limited-edition-black-red-splatter-vinyl.jpg'
    ],
    isActive: true,
    isNew: true
  },
  {
    id: 15,
    name: 'Absence of War Does Not Mean Peace (Gold Vinyl)',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Impaled Nazarene',
      vinylColor: { name: 'Dorado', hex: '#b39a59' },
      format: 'vinyl',
      genre: 'Black Metal',
      label: 'Listenable Records',
      discCount: 1,
      condition: 'new'
    },
    price: 93000,
    description: 'Edición en vinilo dorado de Absence of War Does Not Mean Peace, de Impaled Nazarene. Su presentación dorada destaca de inmediato, mientras el contenido mantiene la mezcla de velocidad, crudeza y provocación que caracteriza a la banda. Una edición singular para coleccionistas de black metal que quieren incorporar un objeto visualmente memorable sin renunciar a una escucha intensa.',
    stock: 3,
    images: [
      'https://shop-listenable.net/24688-large_default/impaled-nazarene-absence-of-war-does-not-mean-peace-lp-gold-vinyl.jpg'
    ],
    isActive: true,
    isNew: true
  },
  {
    id: 16,
    name: 'Famous Monsters (Colour Vinyl)',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Misfits',
      format: 'vinyl',
      genre: 'Horror Punk',
      releaseYear: 2020,
      label: 'Music On Vinyl',
      vinylColor: { name: 'Verde translúcido', hex: '#72da31' },
      discCount: 1,
      condition: 'new'
    },
    price: 225000,
    description: 'Edición en vinilo a color de Famous Monsters, de Misfits. El álbum recupera el imaginario de terror y ciencia ficción de la banda con melodías accesibles, coros reconocibles y una energía punk muy particular. Su formato a color lo convierte en una pieza atractiva para exhibir, además de ser una escucha entretenida para fans de distintas generaciones.',
    stock: 1,
    images: [
      'https://m.media-amazon.com/images/P/B07F6L6H7S.01.L.jpg'
    ],
    isActive: true,
    isNew: false
  },
  {
    id: 17,
    name: 'Altars of Madness (White Vinyl)',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Morbid Angel',
      vinylColor: { name: 'Blanco', hex: '#ffffff' },
      format: 'vinyl',
      genre: 'Death Metal',
      releaseYear: 2022,
      label: 'Listenable Records',
      discCount: 1,
      condition: 'new'
    },
    price: 111000,
    description: 'Edición en vinilo blanco de Altars of Madness, clásico de Morbid Angel. Considerado una obra esencial del death metal, reúne estructuras complejas, una atmósfera oscura y una ejecución que sigue siendo referencia para nuevas generaciones. El disco blanco suma un detalle visual limpio y poco habitual a una edición que merece un lugar central en cualquier colección extrema.',
    stock: 2,
    images: [
      'https://shop-listenable.net/23769-large_default/morbid-angel-altars-of-madness-lp-white-vinyl-.jpg'
    ],
    isActive: true,
    isNew: false
  },
  {
    id: 18,
    name: 'War Master (White Vinyl)',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Bolt Thrower',
      vinylColor: { name: 'Blanco', hex: '#ffffff' },
      format: 'vinyl',
      genre: 'Death Metal',
      releaseYear: 2024,
      label: 'Listenable Records',
      discCount: 1,
      condition: 'new'
    },
    price: 86000,
    description: 'Edición en vinilo blanco de War Master, de Bolt Thrower, disponible en preventa. La banda combina contundencia, precisión y una sensación de avance constante que hace que cada canción se sienta sólida y memorable. Su presentación especial y su disponibilidad anticipada la convierten en una excelente pieza para seguidores del death metal británico y coleccionistas de vinilos de color.',
    stock: 3,
    images: [
      'https://shop-listenable.net/23758-large_default/bolt-thrower-war-master-lp-white-vinyl-pre-order.jpg'
    ],
    isActive: true,
    isNew: true
  },
  {
    id: 19,
    name: 'Fighting the World (Silver Vinyl)',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'Manowar',
      vinylColor: { name: 'Plateado', hex: '#c0c0c0' },
      format: 'vinyl',
      genre: 'Heavy Metal',
      releaseYear: 2024,
      label: 'Listenable Records',
      discCount: 1,
      condition: 'new'
    },
    price: 102000,
    description: 'Reedición limitada en vinilo plateado de Fighting the World, uno de los títulos más reconocidos de Manowar. Su presentación metálica aporta un acabado especial para exhibir, mientras el álbum conserva sus himnos de heavy metal, guitarras épicas y una producción pensada para escucharse a gran volumen. Una pieza ideal para seguidores de la banda y coleccionistas de ediciones especiales.',
    stock: 1,
    images: [
      'https://shop-listenable.net/24673-large_default/manowar-fighting-the-world-limited-edition-silver-vinyl.jpg'
    ],
    isActive: true,
    isNew: true
  },
  {
    id: 20,
    name: 'Thrash Zone (Picture Disc)',
    category: musicCategory,
    details: {
      type: 'music',
      artist: 'D.R.I.',
      vinylColor: { name: 'Picture disc (ilustrado)', hex: '#d49a39' },
      format: 'vinyl',
      genre: 'Thrash Metal',
      releaseYear: 2024,
      label: 'Listenable Records',
      discCount: 1,
      condition: 'new'
    },
    price: 98000,
    description: 'Edición picture disc de Thrash Zone, el álbum de D.R.I. que combina la velocidad del crossover con la agresividad del thrash metal. El disco ilustrado convierte esta reedición en una pieza llamativa para la colección, mientras sus riffs rápidos y canciones directas mantienen intacta la energía de la banda. Una edición especial para quienes disfrutan del punk y el metal en igual medida.',
    stock: 2,
    images: [
      'https://shop-listenable.net/25040-large_default/dri-thrash-zone-lp-picture-disc.jpg'
    ],
    isActive: true,
    isNew: true
  }
];