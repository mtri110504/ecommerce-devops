import { USE_MOCK } from "../config";
import { readDb, writeDb } from "../mocks/mockDb";

export async function createOrder(orderData, currentUser) {
  if (USE_MOCK) {
    if (!currentUser) throw new Error("Chưa đăng nhập");

    const db = readDb();
    const order = {
      id: Date.now(),
      userId: currentUser.id,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      ...orderData,
    };
    db.orders.push(order);
    writeDb(db);
    return order;
  }
}

export async function getMyOrders(currentUser) {
  if (USE_MOCK) {
    const db = readDb();
    return db.orders.filter(o => o.userId === currentUser.id);
  }
  return [];
}

export async function getAllOrders() {
  if (USE_MOCK) {
    const db = readDb();
    return db.orders;
  }
  return [];
}

export async function updateOrderStatus(id, status) {
  if (USE_MOCK) {
    const db = readDb();
    const idx = db.orders.findIndex(o => o.id === id || o.id === Number(id));
    db.orders[idx].status = status;
    writeDb(db);
    return db.orders[idx];
  }
}