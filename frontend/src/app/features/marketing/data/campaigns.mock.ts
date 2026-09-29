import { Campaign } from '../domain/campaign.model';

export const campaigns: Campaign[] = [
  {
    id: 1,
    name: 'Temporada de lanzamientos',
    type: 'season',
    isActive: true,
    order: 1,
    slides: [
      {
        id: 1,
        eyebrow: 'Metal extremo',
        title: 'Nuevos sonidos para tu coleccion',
        description: 'Explora ediciones seleccionadas en vinilo y CD.',
        imageUrl: 'https://f4.bcbits.com/img/0042534543_10.jpg',
        order: 1,
        cta: {
          label: 'Ver novedades',
          action: 'filter',
          value: 'NOVEDADES'
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Lanzamientos Gojira',
    type: 'release',
    isActive: true,
    order: 2,
    slides: [
      {
        id: 2,
        eyebrow: 'Lanzamiento destacado',
        title: 'From Mars To Sirius',
        description: 'Una pieza esencial para coleccionistas de metal progresivo.',
        imageUrl: 'https://f4.bcbits.com/img/0013928875_10.jpg',
        order: 1,
        cta: {
          label: 'Ver lanzamiento',
          action: 'filter',
          value: 'NOVEDADES'
        }
      }
    ]
  }
];