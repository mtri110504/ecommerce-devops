import { USE_MOCK } from "../config";
import { readDb, writeDb } from "../mocks/mockDb";

export async function getProducts() {
  if (USE_MOCK) {
    const db = readDb();
    return db.products;
  }
  return [];
}

export async function getProductById(id) {
  if (USE_MOCK) {
    const db = readDb();
    return db.products.find(p => p.id === Number(id));
  }
  return null;
}

export async function createProduct(data) {
  if (USE_MOCK) {
    const db = readDb();
    const newId = Math.max(...db.products.map(p => p.id), 0) + 1;
    const p = { id: newId, ...data };
    db.products.push(p);
    writeDb(db);
    return p;
  }
}

export async function updateProduct(id, data) {
  if (USE_MOCK) {
    const db = readDb();
    const idx = db.products.findIndex(p => p.id === Number(id));
    db.products[idx] = { ...db.products[idx], ...data };
    writeDb(db);
    return db.products[idx];
  }
}

export async function deleteProduct(id) {
  if (USE_MOCK) {
    const db = readDb();
    db.products = db.products.filter(p => p.id !== Number(id));
    writeDb(db);
    return true;
  }
}