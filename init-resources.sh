#!/bin/bash
set -e 

echo "Creating S3 bucket..."
awslocal s3 mb s3://product-bucket

echo "Verifying SES emails..."
awslocal ses verify-email-identity --email-address no-reply@example.com

echo "Initialization completed successfully!"