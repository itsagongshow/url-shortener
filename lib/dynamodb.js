const core = require('@aws-cdk/core');
const dynamodb = require('@aws-cdk/aws-dynamodb');


// Create DynamoDB
class UrlShortenerTable extends core.Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const urlShortenerTable = new dynamodb.Table(this, 'UrlShortenerTable', {
      tableName: 'url-shortener-table',
      partitionKey: {
        name: 'short_id',
        type: dynamodb.AttributeType.STRING
      },
      removalPolicy: core.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });
}}


module.exports = { UrlShortenerTable };
