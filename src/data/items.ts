// File: src/data/exampleItems.ts

export interface ExampleItem {
    id: string
    title: string
    photoURL: string
    description: string
    price: number
    category: string
  }
  
  export const PRODUCTOS: ExampleItem[] = [
    {
      id: 'flores-rosas',
      title: 'Ramo de Rosas',
      photoURL: 'https://i.pinimg.com/originals/2d/b5/5a/2db55a9daf91091cef0bd5eeba97fe61.jpg',
      description: 'Hermoso ramo de rosas rojas frescas, ideal para decorar cualquier espacio o regalar en ocasiones especiales.',
      price: 29.99,
      category: 'flores',
    },
    {
      id: 'planta-suculenta',
      title: 'Planta Suculenta',
      photoURL: 'https://http2.mlstatic.com/D_NQ_NP_2X_772284-MLA78392811952_082024-F.webp',
      description: 'Planta suculenta de fácil cuidado, perfecta para interiores y oficinas.',
      price: 15.5,
      category: 'plantas',
    },
    {
      id: 'jarron-ceramica',
      title: 'Jarrón de Cerámica',
      photoURL: '/img/example-jarron.jpg',
      description: 'Jarrón artesanal de cerámica esmaltada, ideal para flores naturales o secas.',
      price: 45.0,
      category: 'ceramica',
    },
    {
      id: 'aceite-aromatico',
      title: 'Aceite Aromático',
      photoURL: '/img/example-aceite.jpg',
      description: 'Aceite aromático de lavanda para difusor, que brinda un ambiente relajante.',
      price: 12.75,
      category: 'liquido',
    },
  ]
  