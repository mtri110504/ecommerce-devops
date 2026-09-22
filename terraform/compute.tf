data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_launch_template" "app" {
  name_prefix   = "cloudtech-app-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"

  user_data = base64encode(<<-EOF
    #!/bin/bash
    set -e

    exec > >(tee /var/log/cloudtech-bootstrap.log | logger -t user-data -s 2>/dev/console) 2>&1

    echo "=== CloudTech bootstrap started ==="

    # Install and start Docker
    dnf install -y docker
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ec2-user

    # AWS / ECR configuration
    AWS_REGION="${var.aws_region}"
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_REGISTRY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

    # Login to ECR
    aws ecr get-login-password --region "$AWS_REGION" \
      | docker login \
          --username AWS \
          --password-stdin "$ECR_REGISTRY"

    # RDS configuration
    RDS_HOST="${aws_db_instance.mysql.address}"
    RDS_SECRET_ARN="${aws_db_instance.mysql.master_user_secret[0].secret_arn}"

    RDS_SECRET=$(aws secretsmanager get-secret-value \
      --secret-id "$RDS_SECRET_ARN" \
      --region "$AWS_REGION" \
      --query SecretString \
      --output text)

    DB_USER=$(echo "$RDS_SECRET" | python3 -c 'import sys,json; print(json.load(sys.stdin)["username"])')
    DB_PASSWORD=$(echo "$RDS_SECRET" | python3 -c 'import sys,json; print(json.load(sys.stdin)["password"])')

    # Application JWT secret
    JWT_SECRET=$(aws secretsmanager get-secret-value \
      --secret-id "${data.aws_secretsmanager_secret.app_jwt.arn}" \
      --region "$AWS_REGION" \
      --query SecretString \
      --output text)

    # Pull latest application images
    docker pull "$ECR_REGISTRY/cloudtech-backend:latest"
    docker pull "$ECR_REGISTRY/cloudtech-frontend:latest"

    # Remove old containers if they exist
    docker rm -f cloudtech-backend 2>/dev/null || true
    docker rm -f cloudtech-frontend 2>/dev/null || true

    # Start backend
    docker run -d \
      --name cloudtech-backend \
      --restart unless-stopped \
      -p 5001:5001 \
      -e PORT=5001 \
      -e DB_HOST="$RDS_HOST" \
      -e DB_USER="$DB_USER" \
      -e DB_PASSWORD="$DB_PASSWORD" \
      -e DB_NAME="ecommerce_db" \
      -e JWT_SECRET="$JWT_SECRET" \
      "$ECR_REGISTRY/cloudtech-backend:latest"

    # Start frontend
    docker run -d \
      --name cloudtech-frontend \
      --restart unless-stopped \
      -p 80:80 \
      "$ECR_REGISTRY/cloudtech-frontend:latest"

    echo "=== CloudTech bootstrap completed ==="
  EOF
  )

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2.name
  }

  vpc_security_group_ids = [
    aws_security_group.app.id
  ]

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name    = "cloudtech-app"
      Project = "cloudtech"
    }
  }

  tags = {
    Name = "cloudtech-app-launch-template"
  }
}
