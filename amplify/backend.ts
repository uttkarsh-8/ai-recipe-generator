import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';

const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  'bedrockDS',
  'https://bedrock-runtime.ap-south-1.amazonaws.com',
  {
    authorizationConfig: {
      signingRegion: 'ap-south-1',
      signingServiceName: 'bedrock',
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      'arn:aws:bedrock:ap-south-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0',
    ],
    actions: ['bedrock:InvokeModel'],
  })
);
