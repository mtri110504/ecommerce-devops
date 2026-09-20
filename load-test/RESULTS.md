# k6 Load Test - GET /api/products (local)

## Objective
Load test API GET /api/products với 3 mức tải 10/20/50 virtual users để đo response time, throughput (RPS), error rate và p95 latency.

## Environment
- System: Local Docker Compose
- API endpoint: http://localhost:5001/api/products
- Tool: k6
- Script: load-test/product-api-single.js
- Note: script có sleep(1) nên throughput xấp xỉ VUs/giây.

## Commands
- 10 VUs:
  k6 run --vus 10 --duration 2m --summary-export load-test/summary-10.json load-test/product-api-single.js
- 20 VUs:
  k6 run --vus 20 --duration 2m --summary-export load-test/summary-20.json load-test/product-api-single.js
- 50 VUs:
  k6 run --vus 50 --duration 2m --summary-export load-test/summary-50.json load-test/product-api-single.js

## Results
| Run | VUs | Duration | Avg latency | p95 latency | RPS | Error rate |
|---|---:|---:|---:|---:|---:|---:|
| T1 | 10 | 2m | 12.16 ms | 47.72 ms | 9.844 req/s | 0.00% |
| T2 | 20 | 2m | 6.94 ms | 17.93 ms | 19.683 req/s | 0.00% |
| T3 | 50 | 2m | 5.93 ms | 15.23 ms | 49.660 req/s | 0.00% |

## Notes
- Tất cả thresholds pass, không ghi nhận lỗi HTTP trong các run.
- Khi triển khai lên AWS có thể chạy lại bằng cách đổi BASE_URL, ví dụ:
  k6 run -e BASE_URL="http://<ALB-DNS>" --vus 50 --duration 2m load-test/product-api-single.js