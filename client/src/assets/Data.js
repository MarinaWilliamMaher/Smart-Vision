export const customer = {
  _id: '64df3c064180b81adfe41d4b',
  userName: 'Customer Name',
  email: 'customer@gmail.com',
  gander: 'Male',
  address: '3 street customer',
  phone: 12097953342,
  points: 100,
  orderHistory: [],
  serviceHistory: [],
  customizedHistory: [],
  createdAt: '2023-08-18T09:38:14.179Z',
  updatedAt: '2023-08-21T06:46:18.258Z',
  token: 'hZWFmZmU3NmMiLCJpYXQiOjE2OTIwMzY5',
  verified: true,
};

export const products = [
  {
    _id: '64e2fe620d7868ecff1a6a86',
    name: 'Throw pillow on bed frame',
    description: 'This Bed for two person and it’s very comfortable',
    quantity: 50,
    category: 'bedrooms',
    price: 7000,
    images: [
      'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848329/Smart%20Vision/kenny-eliason-iAftdIcgpFc-unsplash_l33xyj.jpg',
    ],
    likes: [
      '64df3c064180b81adfe41d4b',
      '64df3c064180b81adfe41d4a',
      '64df3c064180b81adfe41d4c',
    ],
    points: 500,
    views: ['64df3c064180b81adfe41d4b', '64df3c064180b81adfe41d4a'],
    show: true,
    createdAt: '2023-08-21T06:04:18.297Z',
    updatedAt: '2023-08-21T06:04:18.297Z',
    __v: 0,
    color:'red'
  },
  {
    _id: '64e2fe620d7868ecff1a6a55',
    name: 'white bed linen with throw pillows',
    description: 'Beautiful White Bed ',
    quantity: 30,
    category: 'bedrooms',
    price: 5000,
    images: [
      'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848324/Smart%20Vision/febrian-zakaria-2QTsCoQnoag-unsplash_vjvjwj.jpg',
    ],
    likes: ['64df3c064180b81adfe41d4b'],
    points: 400,
    views: ['64df3c064180b81adfe41d4b'],
    show: true,
    createdAt: '2023-08-21T06:04:18.297Z',
    updatedAt: '2023-08-21T06:04:18.297Z',
    __v: 0,
    color:'black'
  },
  {
    _id: '64e2fe620d7868ecff1a6a66',
    name: 'white bed linen with throw pillows (2)',
    description: 'Beautiful White Bed (2)',
    quantity: 35,
    category: 'bedrooms',
    price: 6000,
    images: [
      'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848315/Smart%20Vision/vojtech-bruzek-Yrxr3bsPdS0-unsplash_ekmimc.jpg',
    ],
    likes: ['64df3c064180b81adfe41d4b', '64df3c064180b81adfe41d4c'],
    points: 450,
    views: ['64df3c064180b81adfe41d4b'],
    show: true,
    createdAt: '2023-08-21T06:04:18.297Z',
    updatedAt: '2023-08-21T06:04:18.297Z',
    __v: 0,
    color:'red'
  },
  {
    _id: '64e2fe620d7868ecff1a6a77',
    name: 'white bed linen with throw pillows (3)',
    description: 'Beautiful White Bed (3)',
    quantity: 35,
    category: 'bedrooms',
    price: 6000,
    images: [
      'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848315/Smart%20Vision/vojtech-bruzek-Yrxr3bsPdS0-unsplash_ekmimc.jpg',
    ],
    likes: [],
    points: 450,
    views: [],
    show: false,
    createdAt: '2023-08-21T06:04:18.297Z',
    updatedAt: '2023-08-21T06:04:18.297Z',
    __v: 0,
    color:'Red'
  },
];

export const reviews = [
  {
    _id: '54df3c064180b81adfe41d5b',
    user: {
      _id: '64df3c064180b81adfe41d4b',
      userName: 'Customer Name',
    },
    product: '64e2fe620d7868ecff1a6a86',
    comment: 'Very good Product',
    rating: 5,
    createdAt: '2024-01-18T10:11:44.091Z',
    updatedAt: '2024-01-18T10:11:44.091Z',
    __v: 0,
  },
  {
    _id: '64df41b14a4c0d47b5369f4d',
    user: {
      _id: '64df3c064180b81adfe41d4b',
      userName: 'Customer Name',
    },
    product: '64e2fe620d7868ecff1a6a55',
    comment: 'Not bad Product',
    rating: 4,
    createdAt: '2024-01-18T10:11:44.091Z',
    updatedAt: '2024-01-18T10:11:44.091Z',
    __v: 0,
  },
];
