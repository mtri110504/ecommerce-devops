import { USE_MOCK } from "../config";
import { readDb, writeDb } from "../mocks/mockDb";

export async function register({ email, password, name }) {
  if (USE_MOCK) {
    const db = readDb();
    const exists = db.users.some(u => u.email === email);
    if (exists) throw new Error("Email đã tồn tại");

    const newUser = { id: Date.now(), email, password, name, role: "USER" };
    db.users.push(newUser);
    writeDb(db);
    return { message: "OK" };
  }
}

export async function login({ email, password }) {
  if (USE_MOCK) {
    const db = readDb();
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Sai tài khoản hoặc mật khẩu");

    return {
      token: "mock-jwt-token",
      user: { id: user.id, email: user.email, role: user.role, name: user.name }
    };
  }
}
