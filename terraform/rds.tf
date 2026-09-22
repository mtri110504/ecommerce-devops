resource "aws_db_subnet_group" "main" {
  name = "cloudtech-db-subnet-group"

  subnet_ids = [
    aws_subnet.private_1.id,
    aws_subnet.private_2.id
  ]

  tags = {
    Name    = "cloudtech-db-subnet-group"
    Project = "cloudtech"
  }
}

resource "aws_db_instance" "mysql" {
  identifier = "cloudtech-mysql"

  engine         = "mysql"
  instance_class = "db.t3.micro"

  allocated_storage = 20
  storage_type      = "gp3"

  db_name  = "ecommerce_db"
  username = "admin"

  manage_master_user_password = true

  db_subnet_group_name = aws_db_subnet_group.main.name

  vpc_security_group_ids = [
    aws_security_group.rds.id
  ]

  publicly_accessible = false
  multi_az            = false

  backup_retention_period = 1

  skip_final_snapshot = true
  deletion_protection = false

  tags = {
    Name    = "cloudtech-mysql"
    Project = "cloudtech"
  }
}