# ☁️ CloudTech Store – AWS DevOps Ecommerce Platform

CloudTech Store là hệ thống bán hàng trực tuyến được xây dựng nhằm triển khai và vận hành ứng dụng trên AWS theo mô hình DevOps.

Dự án tập trung vào việc tự động hóa hạ tầng bằng Terraform, đóng gói ứng dụng bằng Docker, xây dựng CI/CD bằng GitHub Actions, triển khai ứng dụng trên EC2 Auto Scaling và đánh giá khả năng chịu tải bằng k6.

---

## 1. Mục tiêu

- Xây dựng website bán hàng trực tuyến.
- Container hóa frontend và backend bằng Docker.
- Xây dựng hạ tầng AWS bằng Terraform.
- Tự động build và deploy bằng GitHub Actions.
- Lưu trữ Docker image trên Amazon ECR.
- Triển khai ứng dụng thông qua Application Load Balancer và Auto Scaling Group.
- Sử dụng Amazon RDS MySQL cho cơ sở dữ liệu.
- Quản lý thông tin nhạy cảm bằng AWS Secrets Manager.
- Giám sát hệ thống bằng Amazon CloudWatch.
- Gửi cảnh báo bằng Amazon SNS.
- Kiểm thử tải bằng k6.
- Đánh giá khả năng tự động scale-out và scale-in.

---

## 2. Công nghệ sử dụng

### Application

| Thành phần     | Công nghệ         |
| -------------- | ----------------- |
| Frontend       | React + Vite      |
| Backend        | Node.js + Express |
| Database       | MySQL             |
| Authentication | JWT               |
| Web Server     | Nginx             |
| Container      | Docker            |

### DevOps & AWS

| Thành phần                  | Công nghệ                 |
| --------------------------- | ------------------------- |
| Infrastructure as Code      | Terraform                 |
| CI/CD                       | GitHub Actions            |
| Container Registry          | Amazon ECR                |
| Compute                     | Amazon EC2                |
| Load Balancer               | Application Load Balancer |
| Auto Scaling                | EC2 Auto Scaling          |
| Database                    | Amazon RDS MySQL          |
| Secret Management           | AWS Secrets Manager       |
| Monitoring                  | Amazon CloudWatch         |
| Notification                | Amazon SNS                |
| Load Testing                | k6                        |
| Authentication GitHub → AWS | OpenID Connect (OIDC)     |

---

## 3. Kiến trúc hệ thống

```text
                        Internet
                           │
                           ▼
                Application Load Balancer
                           │
               ┌───────────┴───────────┐
               │                       │
            /api/*                    /*
               │                       │
               ▼                       ▼
          Backend :5001           Frontend :80
               │                       │
               └───────────┬───────────┘
                           │
                  Auto Scaling Group
                    Min: 1 / Max: 2
                           │
                    EC2 Instances
                           │
                           ▼
                     Amazon RDS
                       MySQL
```

Hạ tầng được triển khai trong Amazon VPC với public subnet và private subnet.

EC2 chạy trong public subnet để có thể truy cập ECR và các dịch vụ cần thiết mà không sử dụng NAT Gateway. Security Group chỉ cho phép traffic ứng dụng từ Application Load Balancer.

Amazon RDS được đặt trong private subnet và chỉ cho phép kết nối MySQL từ Security Group của application.

---

## 4. Cấu trúc project

```text
ecommerce-devops/
│
├── backend/
│   ├── Dockerfile
│   └── src/
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│
├── database/
│   └── init.sql
│
├── load-test/
│   ├── product-api.js
│   ├── stress-product-api.js
│   └── autoscaling-test.js
│
├── terraform/
│   ├── alb.tf
│   ├── autoscaling.tf
│   ├── compute.tf
│   ├── ec2_iam.tf
│   ├── ecr.tf
│   ├── github_oidc.tf
│   ├── monitoring.tf
│   ├── network.tf
│   ├── outputs.tf
│   ├── provider.tf
│   ├── rds.tf
│   ├── scaling.tf
│   ├── security_groups.tf
│   └── variables.tf
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── ecr.yml
│
├── docker-compose.yml
└── README.md
```

---

## 5. Infrastructure as Code

Toàn bộ hạ tầng AWS chính được quản lý bằng Terraform.

Các thành phần bao gồm:

- VPC
- Public Subnets
- Private Subnets
- Internet Gateway
- Route Table
- Security Groups
- IAM Roles
- Amazon ECR
- Application Load Balancer
- Target Groups
- Launch Template
- Auto Scaling Group
- Amazon RDS MySQL
- AWS Secrets Manager integration
- CloudWatch Alarm
- SNS Topic
- Auto Scaling Target Tracking Policy
- GitHub Actions OIDC Role

Kiểm tra Terraform:

```bash
cd terraform

terraform init
terraform validate
terraform plan
```

Trạng thái kiểm tra gần nhất:

```text
terraform validate
→ Success! The configuration is valid.

terraform plan
→ No changes. Your infrastructure matches the configuration.
```

---

## 6. Docker

Ứng dụng được chia thành hai Docker image:

```text
cloudtech-frontend
cloudtech-backend
```

Frontend được build bằng Node.js và phục vụ bằng Nginx.

Backend chạy Node.js/Express trên port:

```text
5001
```

Frontend chạy trên:

```text
80
```

Docker images được lưu trữ trên Amazon ECR.

---

## CI/CD Pipeline

Hệ thống sử dụng GitHub Actions để tự động hóa quá trình kiểm thử và triển khai ứng dụng.

Pipeline hiện tại gồm 2 giai đoạn:

### 1. Staging Validation

Khi có thay đổi trong thư mục `backend`, `frontend` hoặc workflow CI/CD được push lên nhánh `main`, GitHub Actions sẽ tạo một môi trường staging tạm thời trên runner.

Môi trường staging gồm:

- MySQL 8 chạy bằng Docker
- Backend chạy bằng Docker
- Frontend chạy bằng Docker
- Backend smoke test tại `/api/products`
- Frontend smoke test tại `/`

Nếu bất kỳ bước nào thất bại, Production Deployment sẽ không được thực hiện.

### 2. Production Deployment

Sau khi Staging Validation thành công, workflow sẽ chờ phê duyệt thủ công thông qua GitHub Environment `production`.

Sau khi được approve:

1. GitHub Actions xác thực với AWS bằng OIDC.
2. Build Docker image cho backend và frontend.
3. Push image lên Amazon ECR.
4. Khởi chạy Auto Scaling Instance Refresh.
5. Chờ quá trình triển khai hoàn tất.
6. Thực hiện Production Smoke Test qua Application Load Balancer.

Luồng triển khai:

````text
Push main
   ↓
Staging Validation
   ↓
Backend + Frontend Smoke Test
   ↓
Manual Approval
   ↓
Push Docker Images to ECR
   ↓
Auto Scaling Instance Refresh
   ↓
Production Smoke Test
   ↓
Deployment Success

---

## 8. Automatic Deployment Test

Pipeline CD đã được kiểm thử end-to-end.

Sau khi push code lên `main`:

```text
GitHub Actions
→ Success
````

Auto Scaling Instance Refresh:

```text
Status     : Successful
Percentage : 100%
```

Instance mới sau deployment:

```text
State  : InService
Health : Healthy
```

API được kiểm tra thông qua Application Load Balancer:

```text
GET /api/products
HTTP/1.1 200 OK
```

Điều này xác nhận quá trình từ Git push đến deployment trên AWS được thực hiện tự động thành công.

---

## 9. Auto Scaling

Auto Scaling Group được cấu hình:

```text
Minimum Capacity : 1
Desired Capacity : 1
Maximum Capacity : 2
```

Target Tracking Policy:

```text
Metric : ASG Average CPU Utilization
Target : 50%
```

### Scale-out

Trong quá trình load test, CloudWatch AlarmHigh được kích hoạt:

```text
Desired Capacity
1 → 2
```

AWS tự động tạo thêm EC2 instance.

Sau khi instance mới khởi động, cả hai instance đều đạt:

```text
Frontend Target Group : healthy
Backend Target Group  : healthy
```

### Scale-in

Sau khi load test kết thúc, CPU giảm xuống khoảng:

```text
0.3% – 0.4%
```

CloudWatch AlarmLow được kích hoạt và Auto Scaling Group tự động giảm:

```text
Desired Capacity
2 → 1
```

Instance dư thừa được đưa vào quá trình ELB Connection Draining trước khi terminate.

---

## 10. Load Testing

Load testing được thực hiện bằng k6.

### Baseline Test

```text
Maximum VUs : 50
Requests    : 6,524
Throughput  : ~22.45 req/s
Error Rate  : 0%
p95         : 70.58 ms
```

Hệ thống hoạt động ổn định và chưa cần Auto Scaling.

### Stress Test

```text
Maximum VUs : 200
Requests    : 618,543
Throughput  : ~1,472.72 req/s
p95         : 124.12 ms
Failed      : 1 request
```

CPU tăng nhưng chưa duy trì trên Target Tracking threshold đủ lâu để scale-out.

### Auto Scaling Test

Duy trì 200 VUs trong khoảng 5 phút:

```text
Maximum VUs : 200
Requests    : 628,402
Throughput  : ~1,745.41 req/s
Average     : 104.88 ms
p95         : 129.09 ms
Failed      : 1 request
```

Trong bài kiểm thử này, Target Tracking Policy được kích hoạt và hệ thống tự động:

```text
1 EC2 → 2 EC2
```

Sau khi tải giảm:

```text
2 EC2 → 1 EC2
```

Qua đó xác nhận khả năng tự động mở rộng và thu hẹp tài nguyên theo tải.

---

## 11. Monitoring

Amazon CloudWatch được sử dụng để giám sát CPU của Auto Scaling Group.

CloudWatch Alarm:

```text
Alarm     : cloudtech-high-cpu
Threshold : CPU > 70%
Period    : 60 seconds
Evaluation: 2 periods
```

Khi alarm được kích hoạt:

```text
CloudWatch
     │
     ▼
SNS Topic
cloudtech-alerts
     │
     ▼
Email Notification
```

SNS Email Subscription đã được xác nhận và kiểm thử gửi thông báo thành công.

---

## 12. Security

Một số biện pháp bảo mật được áp dụng:

- Security Group giới hạn traffic giữa các thành phần.
- EC2 không mở SSH ra Internet.
- AWS Systems Manager được sử dụng để quản lý EC2.
- RDS không public ra Internet.
- RDS chỉ cho phép MySQL traffic từ application Security Group.
- Database credentials được quản lý bằng AWS Secrets Manager.
- JWT secret được lưu trong AWS Secrets Manager.
- GitHub Actions sử dụng AWS OIDC thay cho static Access Key.
- `.env` và Terraform state không được commit lên Git.

---

## 13. Chạy ứng dụng local

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:8080
```

Backend API:

```text
http://localhost:5001
```

---

## 14. Load Test

Ví dụ chạy baseline test:

```bash
cd load-test

BASE_URL=http://cloudtech-alb-276288998.ap-southeast-1.elb.amazonaws.com \
k6 run product-api.js
```

Stress test:

```bash
BASE_URL=http://cloudtech-alb-276288998.ap-southeast-1.elb.amazonaws.com \
k6 run stress-product-api.js
```

Auto Scaling test:

```bash
BASE_URL=http://cloudtech-alb-276288998.ap-southeast-1.elb.amazonaws.com \
k6 run autoscaling-test.js
```

---

## 15. Kết quả

Hệ thống đã triển khai thành công các thành phần chính của mô hình DevOps:

- Infrastructure as Code bằng Terraform.
- Container hóa ứng dụng bằng Docker.
- CI/CD bằng GitHub Actions.
- Tự động build và push Docker image lên ECR.
- Tự động triển khai phiên bản mới bằng ASG Instance Refresh.
- Load balancing bằng Application Load Balancer.
- Auto Scaling theo CPU.
- Database MySQL trên Amazon RDS.
- Quản lý secrets bằng AWS Secrets Manager.
- Monitoring bằng CloudWatch.
- Alert bằng SNS.
- Load testing bằng k6.

Kết quả kiểm thử cho thấy hệ thống có khả năng tự động scale-out khi tải tăng và scale-in khi tải giảm.

---

## 16. Hướng phát triển

Một số chức năng có thể tiếp tục phát triển:

- HTTPS với AWS Certificate Manager khi có domain.
- Route 53 cho custom domain.
- CloudWatch Dashboard.
- Centralized application logging.
- Blue/Green hoặc Canary Deployment.
- Web Application Firewall (AWS WAF).

---

## Author

**Bùi Minh Trí**

Electronics & Telecommunications  
Cloud / DevOps
