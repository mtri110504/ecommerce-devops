import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5001";

export const options = {
  thresholds: {
    http_req_failed: ["rate<0.01"],   // error rate < 1%
    http_req_duration: ["p(95)<800"], // p95 < 800ms (tùy chỉnh)
  },
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

export default function () {
  const res = http.get(`${BASE_URL}/api/products`, {
    headers: { Accept: "application/json" },
    tags: { name: "GET /api/products" },
  });

  check(res, { "status is 200": (r) => r.status === 200 });

  sleep(1);
}