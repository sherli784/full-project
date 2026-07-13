import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

// Simple file-based database for temporary use
class FileDatabase {
  constructor() {
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        this.db = JSON.parse(data);
      } else {
        this.db = { products: [], orders: [], offers: [], users: [] };
        this.saveData();
      }
    } catch (error) {
      console.error('Error loading database:', error);
      this.db = { products: [], orders: [], offers: [], users: [] };
    }
  }

  saveData() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // Product methods
  async findProducts(filter = {}) {
    return this.db.products;
  }

  async createProduct(productData) {
    const product = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString()
    };
    this.db.products.push(product);
    this.saveData();
    return product;
  }

  async updateProduct(id, updateData) {
    const index = this.db.products.findIndex(p => p._id === id || p.id === id);
    if (index !== -1) {
      this.db.products[index] = { ...this.db.products[index], ...updateData };
      this.saveData();
      return this.db.products[index];
    }
    return null;
  }

  async deleteProduct(id) {
    const index = this.db.products.findIndex(p => p._id === id || p.id === id);
    if (index !== -1) {
      this.db.products.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // Order methods
  async findOrders(filter = {}) {
    return this.db.orders;
  }

  async createOrder(orderData) {
    const order = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      ...orderData,
      createdAt: new Date().toISOString()
    };
    this.db.orders.push(order);
    this.saveData();
    return order;
  }

  // User methods
  async findUsers(filter = {}) {
    return this.db.users;
  }

  async createUser(userData) {
    const user = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.db.users.push(user);
    this.saveData();
    return user;
  }

  async updateUser(id, updateData) {
    const index = this.db.users.findIndex(u => u._id === id || u.id === id);
    if (index !== -1) {
      this.db.users[index] = { ...this.db.users[index], ...updateData };
      this.saveData();
      return this.db.users[index];
    }
    return null;
  }

  async deleteUser(id) {
    const index = this.db.users.findIndex(u => u._id === id || u.id === id);
    if (index !== -1) {
      this.db.users.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // Offer methods
  async findOffers(filter = {}) {
    return this.db.offers;
  }

  async createOffer(offerData) {
    const offer = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      ...offerData,
      createdAt: new Date().toISOString()
    };
    this.db.offers.push(offer);
    this.saveData();
    return offer;
  }
}

export default new FileDatabase();
