# IAM Role cho EC2
resource "aws_iam_role" "ec2" {
  name = "cloudtech-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "cloudtech-ec2-role"
  }
}


# Cho phép EC2 pull Docker image từ ECR
resource "aws_iam_role_policy" "ec2_ecr" {
  name = "cloudtech-ec2-ecr-policy"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "ecr:GetAuthorizationToken"
        ]

        Resource = "*"
      },

      {
        Effect = "Allow"

        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]

        Resource = [
          aws_ecr_repository.backend.arn,
          aws_ecr_repository.frontend.arn
        ]
      }
    ]
  })
}


# Instance Profile để gắn IAM Role vào EC2
resource "aws_iam_instance_profile" "ec2" {
  name = "cloudtech-ec2-instance-profile"
  role = aws_iam_role.ec2.name
}