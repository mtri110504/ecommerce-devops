import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL;

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 50 },

    { duration: "30s", target: 100 },
    { duration: "2m", target: 100 },

    { duration: "30s", target: 200 },
    { duration: "2m", target: 200 },

    { duration: "30s", target: 0 },
  ],

  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1000"],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/products`, {
    tags: { name: "GET /api/products" },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}
