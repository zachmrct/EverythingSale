const fs = require('fs');
const Product = require('../models/Product'); // Update with your actual model path
const Collection = require('../models/ProductCol'); // Update with your actual model path
const User = require('../models/User'); // Update with your actual model path
const Order = require('../models/Order'); // Update with your actual model path

// mock data only
const collectionsJson = "src/models/data/data-collections.json";
const productsJson = "src/models/data/data-products.json";
const usersJson = "src/models/data/data-users.json";
const ordersJson = "src/models/data/data-orders.json";

function parseJson(pathToJson) {
  try {
    return JSON.parse(fs.readFileSync(pathToJson));
  } catch (error) {
    console.error(`Error reading or parsing JSON from ${pathToJson}:`, error);
    throw error; // Re-throw the error after logging it
  }
}

// load initial data (mock data)

// load products
async function loadProducts() {
  try {
    const result = parseJson(productsJson);
    await Product.deleteMany({})
      .then(() => {
        return Product.insertMany(result);
      })
      .then((products) => {
        products.forEach(product => {
          console.log(`Product added: ${product.name}`);
        });
      })
      .catch((error) => {
        console.error('Error inserting products:', error);
      });
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// load collections
async function loadCollections() {
  try {
    const result = parseJson(collectionsJson);
    await Collection.deleteMany({})
      .then(() => {
        return Collection.insertMany(result);
      })
      .then((collections) => {
        collections.forEach(collection => {
          console.log(`Collection added: ${collection.name}`);
        });
      })
      .catch((error) => {
        console.error('Error inserting collections:', error);
      });
  } catch (error) {
    console.error('Error loading collections:', error);
  }
}

// load users
async function loadUsers() {
  try {
    const result = parseJson(usersJson);
    await User.deleteMany({});
    for (const userData of result) {
      const user = new User(userData);
      await user.save()
        .then(() => {
          console.log(`User added: ${user.username}`);
        })
        .catch((error) => {
          console.error(`Error saving user ${user.username}:`, error);
        });
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

async function loadOrders() {
  try {
    const result = parseJson(ordersJson);
    await Order.deleteMany({});
    for (const orderData of result) {
      const order = new Order(orderData);
      await order.save()
        .then(() => {
          console.log(`Order added: ${order.customer}`);
        })
        .catch((error) => {
          console.error(`Error saving order for ${order.customer}:`, error);
        });
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

module.exports = { 
  loadCollections, 
  loadProducts,
  loadUsers,
  loadOrders,
};
