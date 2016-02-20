## The goal

On a push to master update an s3 bucket.

Following this guide
https://aws.amazon.com/blogs/compute/dynamic-github-actions-with-aws-lambda/


1) github webhook  -->  2) AWS SNS message -->  3) AWS Lambda

1. Wire up a github webhook to call SNS.
2. SNS will relay to AWS Lambda.
3. Lambda will process the data and decide if s3 needs to be updated.
