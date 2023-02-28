const core = require('@aws-cdk/core');
const apigw = require('@aws-cdk/aws-apigateway');
const lambda = require('@aws-cdk/aws-lambda');
const iam = require('@aws-cdk/aws-iam');


// Create API Gateway and Lambdas
class ApiGateway extends core.Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    
    // Create retrieve lambda function
    const retrieveFunction = new lambda.Function(this, 'retrieve', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'retrieve.lambda_handler',
      code: lambda.Code.fromAsset('resources/retrieve'),
    });

    // Create API Gateway
    const api = new apigw.RestApi(this, 'ApiGateway');

    // Create the retrieve post method
    const tResource = api.root.addResource('t');
    const shortIdResource = tResource.addResource('{shortid}');
    const retrieveIntegration = new apigw.LambdaIntegration(retrieveFunction,
      {
        proxy: false,
        passthroughBehavior: apigw.PassthroughBehavior.NEVER,
        integrationResponses: [{
            statusCode: '301',
            responseParameters: {
              'method.response.header.Location': 'integration.response.body.location',
            },
        }],
        requestTemplates: {
            "application/json": '{"short_id": "$input.params(\'shortid\')"}',
          },
      }
    );

    shortIdResource.addMethod('GET', retrieveIntegration, {
      methodResponses: [{
        statusCode: '301',
        responseParameters: {
          'method.response.header.Location': true,
        },
      }]
    });

    // Create create lambda function
    const createFunction = new lambda.Function(this, 'create', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'create.lambda_handler',
      code: lambda.Code.fromAsset('resources/create'),
      environment: {
        APP_URL: `${api.restApiId}.execute-api.ca-central-1.amazonaws.com/prod/t/`,
        MIN_CHAR: '4',
        MAX_CHAR: '8'
      }
    });

    // Add the create post method
    api.root.addResource('create').addMethod('POST', new apigw.LambdaIntegration(createFunction));

    // Add required dynamodb policies
    createFunction.addToRolePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['dynamodb:PutItem',
      'dynamodb:DeleteItem',
      'dynamodb:GetItem',
      'dynamodb:Query',
      'dynamodb:UpdateItem']
    }));

    retrieveFunction.addToRolePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['dynamodb:PutItem',
      'dynamodb:DeleteItem',
      'dynamodb:GetItem',
      'dynamodb:Query',
      'dynamodb:UpdateItem']
    }));

  }
}

module.exports = { ApiGateway };
