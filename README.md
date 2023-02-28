# Serverless URL Shortener

Simple serverless URL shortener that is deployed via Github Actions with the use of AWS CDK.

## Requirements

You will need these three secrets in your Github secrets. To access it, go to Settings -> Secrets and Variables -> Actions and add in two repository secrets

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

It must have access to CloudFormation, API Gateways, DynamoDb and Lambdas. The simplest way to ensure it works is give the user Admin Access.


## What It Does

- Creates a DynamoDB table for storing short url values
- Deploys two lambda functions: one to create a short url and the other to retrieve the short url
- Create an API gateway to with a POST method to create a short url and GET method to retrieve said short url

## Installation

No installation needed. Simply run the aws-deploy Github Actions workflow with the specified requirements.

## Usage

Once the Github Action is run and deployed, you can find the API Gateway URL from the `Deploy Stack` step.

![alt text](https://i.ibb.co/0qSBkQk/image.png)

You can now create shortened URL by running:

```
curl -XPOST -H "Content-Type: application/json" https://hf3ku92xf2.execute-api.ca-central-1.amazonaws.com/prod/create -d '{"long_url": "<URL>"}'
```

Example:
```
curl -XPOST -H "Content-Type: application/json" https://hf3ku92xf2.execute-api.ca-central-1.amazonaws.com/prod/create -d '{"long_url": "https://www.google.com/search?q=battlefy"}'
```
```
{"short_id":"https://hf3ku92xf2.execute-api.ca-central-1.amazonaws.com/prod/t/zjptx","long_url":"https://www.google.com/search?q=battlefy"}
```

You can then simply use the `short_id` URL to access the page. Performing a GET will output
```
curl -XGET https://hf3ku92xf2.execute-api.ca-central-1.amazonaws.com/prod/t/zjptx
```

```
{"statusCode": 301, "location": "https://www.google.com/search?q=battlefy"}
```

### The Operations
You can throttle traffice by performing something similar to
```
aws apigatewayv2 update-stage \
    --api-id a1b2c3d4 \
    --stage-name dev \
    --route-settings '{"GET /pets":{"ThrottlingBurstLimit":100,"ThrottlingRateLimit":2000}}'
```

There are multiple angles for throttling:
- Per-client or per-method throttling limits that you set for an API stage in a usage plan
- Per-method throttling limits that you set for an API stage.
- Account-level throttling per Region
- AWS Regional throttling

### Minimizing Costs
Setting DynamoDB to use `use-demand` should reduce cost but should be monitored in case there is a sudden increase in load. However, I do not think this feature should have a sudden increase in cost. Also there really is only one table usage for this feature. Another way to reduce cost is preferrably to setup DynamoDB is a zone with lesser costs. You can also use CloudFront to reduce data transfer costs. Although in this case, I'm not sure that is necessary.

### Security
You can protect the API but limiting where you can access it such us locking it behind the VPN. Also using a Lambda Authorizer should be able to control who can perform what. You can also setup a firewall and set throttling targets. 
