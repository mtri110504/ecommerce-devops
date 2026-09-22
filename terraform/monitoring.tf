resource "aws_sns_topic" "alerts" {
  name = "cloudtech-alerts"

  tags = {
    Name    = "cloudtech-alerts"
    Project = "cloudtech"
  }
}

resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "cloudtech-high-cpu"
  alarm_description   = "Alert when average EC2 CPU in the Auto Scaling Group is above 70%"
  comparison_operator = "GreaterThanThreshold"

  evaluation_periods = 2
  period             = 60
  threshold          = 70

  namespace   = "AWS/EC2"
  metric_name = "CPUUtilization"
  statistic   = "Average"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.app.name
  }

  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]

  ok_actions = [
    aws_sns_topic.alerts.arn
  ]

  treat_missing_data = "notBreaching"

  tags = {
    Name    = "cloudtech-high-cpu"
    Project = "cloudtech"
  }
}
