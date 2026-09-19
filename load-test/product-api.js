import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5001";

export const options = {
  stages: [
    { duration: "30s", target: 10 }, // ramp to 10 VUs
    { duration: "1m", target: 10 },  // hold 10 VUs

    { duration: "30s", target: 20 }, // ramp to 20 VUs
    { duration: "1m", target: 20 },  // hold 20 VUs

    { duration: "30s", target: 50 }, // ramp to 50 VUs
    { duration: "1m", target: 50 },  // hold 50 VUs

    { duration: "20s", target: 0 },  // ramp down
  ],

  thresholds: {
    http_req_failed: ["rate<0.01"],           // error rate < 1%
    http_req_duration: ["p(95)<800"],         // p95 latency < 800ms (tùy bạn chỉnh)
  },

  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

export default function () {
  const url = `${BASE_URL}/api/products`;

  const res = http.get(url, {
    headers: { Accept: "application/json" },
    tags: { name: "GET /api/products" },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1); // mô phỏng “người dùng” đọc trang 1s
}