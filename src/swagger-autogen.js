// swagger-autogen.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'E-Commerce API',
    description: 'Auto-generated Swagger documentation',
  },
  host: 'ecommernceapi-ctz4.onrender.com/',
  schemes: ['https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
      description: 'Format: Bearer <token>'
    }
  },
  definitions: {
    Product: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        slug: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string', description: 'Category ObjectId' },
        brand: { type: 'string' },
        image: { type: 'string' },
        basePrice: { type: 'number' },
        user: { type: 'string', description: 'User ObjectId' }
      },
      example: {
        name: 'T-Shirt',
        slug: 't-shirt',
        description: 'Comfortable cotton tee',
        category: '64f3c9b...',
        brand: 'Acme',
        image: 'no-photo.jpg',
        basePrice: 19.99,
        user: '64f3c9b...'
      }
    },
    ProductCreate: {
      allOf: [ { $ref: '#/definitions/Product' } ]
    },
    ProductUpdate: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        brand: { type: 'string' },
        image: { type: 'string' },
        basePrice: { type: 'number' }
      }
    },
    Category: {
      properties: {
        name: { type: 'string' },
        descriptiom: { type: 'string' },
        image: { type: 'string' }
      },
      example: {
        name: 'Clothing',
        descriptiom: 'All clothing items',
        image: 'no-photo.jpg'
      }
    },
    CategoryCreate: {
      allOf: [ { $ref: '#/definitions/Category' } ]
    },
    Variant: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'Product ObjectId' },
        sku: { type: 'string' },
        color: { type: 'string' },
        size: { type: 'string' },
        material: { type: 'string' },
        image: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'integer' },
        isActive: { type: 'boolean' }
      },
      example: {
        productId: '64f3c9b...',
        sku: 'TSHIRT-BLK-M',
        color: 'Black',
        size: 'M',
        material: 'Cotton',
        image: 'image.jpg',
        price: 22.5,
        stock: 100,
        isActive: true
      }
    },
    VariantCreate: {
      allOf: [ { $ref: '#/definitions/Variant' } ]
    },
    OrderItem: {
      type: 'object',
      properties: {
        product: { type: 'string' },
        variant: { type: 'string' },
        quantity: { type: 'integer' },
        price: { type: 'number' }
      },
      required: ['product', 'quantity', 'price']
    },
    OrderCreate: {
      type: 'object',
      properties: {
        orderItems: { type: 'array', items: { $ref: '#/definitions/OrderItem' } },
        shippingAddress: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            postalCode: { type: 'string' },
            country: { type: 'string' }
          }
        },
        paymentMethod: { type: 'string', enum: ['card','upi','cod'] },
        totalAmount: { type: 'number' }
      },
      example: {
        orderItems: [
          { product: '64f3c9b...', variant: '64f3c9b...', quantity: 2, price: 19.99 }
        ],
        shippingAddress: {
          street: '123 Main St', city: 'City', state: 'State', postalCode: '12345', country: 'Country'
        },
        paymentMethod: 'cod',
        totalAmount: 59.97
      }
    }
  },
  tags: [
    {
      name: 'Auth1',
      description: 'Endpoints related to authentication',
    },
    {
      name: 'Product',
      description: 'Endpoints related to products',
    },
    {
      name: 'Category',
      description: 'Endpoints related to categories',
    },
    {
      name: 'Order',
      description: 'Endpoints related to orders',
    },
    {
      name: 'Variant',
      description: 'Endpoints related to product variants',
    },
  ],
};

// ✅ Define where to output the generated swagger file
const outputFile = './swagger-output.json';

// ✅ Define the files containing your route definitions
const endpointsFiles = [
  './app.js', // include app to capture base paths like /api/v1/*
  './routes/authRoutes.js',
  './routes/productRoutes.js',
  './routes/orderRoutes.js',
  './routes/categoryRoutes.js',
  './routes/variantRoutes.js',
];

// ✅ Generate swagger JSON and start your app after generation
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app.js'); // or app.js — replace with your main file
});
