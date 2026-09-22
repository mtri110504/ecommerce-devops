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

  dnf update -y
  dnf install -y docker

  systemctl enable docker
  systemctl start docker

  usermod -aG docker ec2-user
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