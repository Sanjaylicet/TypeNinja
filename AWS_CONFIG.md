# TypeNinja AWS Architecture & Configuration

This document contains the AWS Solution Architecture deliverables for the TypeNinja static SPA.

---

## Deliverable 2: AWS Organization & RBAC Implementation

### 1. Create Organizational Unit (OU)
To create the `Development` OU, execute the following command (requires administrative access to the AWS Organizations Management account):

```bash
# Replace <PARENT_ID> with the ID of your Root or parent OU
aws organizations create-organizational-unit \
    --parent-id <PARENT_ID> \
    --name "Development"
```

### 2. IAM Customer Managed Policy: `Frontend-Developers-Policy`
This policy allows access to Amplify, CloudWatch, and Budgets while explicitly denying EC2, RDS, and Lambda.

**Policy JSON:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowFrontendServices",
            "Effect": "Allow",
            "Action": [
                "amplify:*",
                "cloudwatch:*",
                "budgets:*"
            ],
            "Resource": "*"
        },
        {
            "Sid": "DenyBackendServices",
            "Effect": "Deny",
            "Action": [
                "ec2:*",
                "rds:*",
                "lambda:*"
            ],
            "Resource": "*"
        }
    ]
}
```

**CLI Command to create the policy:**
```bash
aws iam create-policy \
    --policy-name Frontend-Developers-Policy \
    --policy-document file://frontend-policy.json
```

---

## Deliverable 3: Cost-Model & Cost-Benefit Analysis

### Analysis
The choice of **AWS Amplify Static Hosting** over a traditional **EC2 + RDS** architecture is driven by the "zero-cost" requirement. For a static SPA like TypeNinja, Amplify leverages the AWS Free Tier (12 months) and a pay-as-you-go model that is significantly cheaper than provisioning virtual servers. With 5,000 visitors per month, the data transfer and build minutes will likely fall within the free tier or cost pennies, whereas an EC2 `t3.micro` instance and a small RDS instance would incur a baseline cost of ~$25-$30/month regardless of traffic.

By eliminating the server-side runtime (EC2) and the managed database (RDS), we remove the largest fixed costs in the AWS ecosystem. Estimated monthly costs for Amplify with 5,000 visitors (assuming 1MB per page load) would be approximately **$0.01 - $0.05** for bandwidth (after free tier), while EC2/RDS would consume **$30.00+**. This architecture ensures the $100 credit lasts for the entire project lifecycle, potentially for years, rather than being depleted in 3 months.

---

## Deliverable 4: Cloud Resource Alerts (CloudWatch)

Create an Amazon CloudWatch Alarm that triggers if the Amplify app exceeds 1 GB of `BytesDownloaded` in a single day.

**CLI Command:**
```bash
aws cloudwatch put-metric-alarm \
    --alarm-name "AmplifyHighTrafficAlert" \
    --alarm-description "Triggers if BytesDownloaded exceeds 1GB in 24 hours" \
    --metric-name "BytesDownloaded" \
    --namespace "AWS/AmplifyHosting" \
    --statistic "Sum" \
    --period 86400 \
    --threshold 1000000000 \
    --comparison-operator "GreaterThanThreshold" \
    --dimensions Name=AppId,Value=<YOUR_AMPLIFY_APP_ID> \
    --evaluation-periods 1 \
    --alarm-actions <YOUR_SNS_TOPIC_ARN>
```

---

## Deliverable 5: Billing Alerts (AWS Budgets)

Create an AWS Cost Budget fixed at $2.00 per month with alerts at 50% and 100%.

**Budget Configuration (budget.json):**
```json
{
    "BudgetName": "TypeNinja-Monthly-Budget",
    "BudgetLimit": {
        "Amount": "2.00",
        "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
}
```

**Notifications Configuration (notifications.json):**
```json
[
    {
        "Notification": {
            "NotificationType": "ACTUAL",
            "ComparisonOperator": "GREATER_THAN",
            "Threshold": 50,
            "ThresholdType": "PERCENTAGE"
        },
        "Subscribers": [
            {
                "SubscriptionType": "EMAIL",
                "Address": "your-email@example.com"
            }
        ]
    },
    {
        "Notification": {
            "NotificationType": "ACTUAL",
            "ComparisonOperator": "GREATER_THAN",
            "Threshold": 100,
            "ThresholdType": "PERCENTAGE"
        },
        "Subscribers": [
            {
                "SubscriptionType": "EMAIL",
                "Address": "your-email@example.com"
            }
        ]
    }
]
```

**CLI Command:**
```bash
aws budgets create-budget \
    --account-id <YOUR_ACCOUNT_ID> \
    --budget file://budget.json \
    --notifications-with-subscribers file://notifications.json
```
