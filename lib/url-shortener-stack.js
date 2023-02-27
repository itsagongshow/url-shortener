const cdk = require('@aws-cdk/core');
const apiGateway = require('../lib/gateway');
const dynamodb = require('../lib/dynamodb');

class UrlShortenerStack extends cdk.Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    new apiGateway.ApiGateway(this, 'ApiGateway')
    new dynamodb.UrlShortenerTable(this, 'UrlShortenerTable')
  }
}

module.exports = { UrlShortenerStack }
