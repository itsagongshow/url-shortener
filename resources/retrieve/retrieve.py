import os
import json
import boto3

# This is for retrieving the long url from dynamodb

ddb = boto3.resource('dynamodb', region_name = 'ca-central-1').Table('url-shortener-table')

def lambda_handler(event, context):
    short_id = event.get('short_id')

    try:
        item = ddb.get_item(Key={'short_id': short_id})
        long_url = item.get('Item').get('long_url')
        ddb.update_item(
            Key={'short_id': short_id},
            UpdateExpression='set hits = hits + :val',
            ExpressionAttributeValues={':val': 1}
        )

    except:
        return {
            'statusCode': 301,
            'location': ''
        }

    return {
        "statusCode": 301,
        "location": long_url
    }
