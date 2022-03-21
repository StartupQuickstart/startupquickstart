import { fromSSO } from '@aws-sdk/credential-provider-sso';

const config = {};
if (process.env.AWS_SSO) {
}

const credentials = await fromSSO({ profile: 'default' })();
const route53 = new AWS.Route53({ credentials: credentials });
