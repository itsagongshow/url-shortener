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

> Note: `https://4373rw3nwk.execute-api.ca-central-1.amazonaws.com/prod/` is online and can be used to create shortened URL.

## Usage

Once the Github Action is run and deployed, you can find the API Gateway URL from the `Deploy Stack` step.

![alt text](https://i.ibb.co/qxnfcyy/image.png))

You can now create shortened URL by running:

```
curl -XPOST -H "Content-Type: application/json" https://4373rw3nwk.execute-api.ca-central-1.amazonaws.com/prod/create -d '{"long_url": "<URL>"}'
```
You can then simply use the `short_id` URL to access the page:
```
curl -XGET https://4373rw3nwk.execute-api.ca-central-1.amazonaws.com/prod/t/<short_id>
```

Example:
```
curl -XPOST -H "Content-Type: application/json" https://4373rw3nwk.execute-api.ca-central-1.amazonaws.com/prod/create -d '{"long_url": "https://www.google.com/search?q=battlefy&oq=battlefy&aqs=edge.0.69i59l3j0i273j0i512l2j69i60j69i61l2.1073j0j1&sourceid=chrome&ie=UTF-8"}'
```
Output
```
{"short_id":"https://4373rw3nwk.execute-api.ca-central-1.amazonaws.com/prod/t/zZSFx8SpLqvyvLD","long_url":"https://www.google.com/search?q=battlefy&oq=battlefy&aqs=edge.0.69i59l3j0i273j0i512l2j69i60j69i61l2.1073j0j1&sourceid=chrome&ie=UTF-8"}
```

Performing a GET will output:
```
curl -XGET https://4373rw3nwk.execute-api.ca-central-1.amazonaws.com/prod/t/zZSFx8SpLqvyvLD
```
And will also redirect you to the original URL if link is used in a browser.

Output
```
{"statusCode": 301, "location": "https://www.google.com/search?q=battlefy&oq=battlefy&aqs=edge.0.69i59l3j0i273j0i512l2j69i60j69i61l2.1073j0j1&sourceid=chrome&ie=UTF-8"}
```
