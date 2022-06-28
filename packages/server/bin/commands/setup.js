const inquirer = require('inquirer');
const { ssm } = require('../../dist/lib/aws');
const dotenv = require('dotenv');
const { loadConfig } = require('../../dist/config');

module.exports = (cli) => {
  return async (opts) => {
    try {
      const options = Object.assign(cli.opts(), opts);
      process.env.ENV = options.env || process.env.ENV;
      const config = await loadConfig();

      console.log('Setting up app secrets...');
      const existing = await ssm.getParam(
        `shared/_/secret`,
        options.env,
        process.env.APP
      );

      if (existing) {
        console.log('Secret is already set');
      } else {
        const secret = crypto.randomBytes(bytes).toString('hex');
        await ssm.setParam(`shared/_/secret`, secret, true, options.env);
      }

      const defaultAnswers = {
        stripeSecretKey: config?.stripe?.secretKey,
        stripePublishableKey: config?.stripe?.publishableKey,
        hubspotApiKey: config?.hubspot?.apiKey,
        requireSubscription: config?.app?.requireSubscription || false,
        syncWithHubspot: config?.hubspot?.apiKey || false,
        useSubscriptions:
          (config?.stripe?.secretKey && config?.stripe?.publishableKey) || false
      };

      const answers = await inquirer.prompt(
        [
          {
            name: 'syncWithHubspot',
            message: 'Do you want to sync contacts and accounts with Hubspot?',
            type: 'confirm',
            askAnswered: true,
            default: defaultAnswers.syncWithHubspot
          },
          {
            name: 'hubspotApiKey',
            message: 'Hubspot Api Key',
            type: 'input',
            required: true,
            askAnswered: true,
            default: config?.hubspot?.apiKey,
            when: (answers) => answers.syncWithHubspot
          },
          {
            name: 'useSubscriptions',
            message: 'Do you want to use Stripe for subscriptions?',
            type: 'confirm',
            askAnswered: true,
            default: defaultAnswers.useSubscriptions
          },
          {
            name: 'requireSubscription',
            message: 'Should we require subscriptions by default?',
            type: 'confirm',
            askAnswered: true,
            default: defaultAnswers.requireSubscription
          },
          {
            name: 'stripeSecretKey',
            message: 'Stripe Secret Key',
            type: 'input',
            required: true,
            askAnswered: true,
            default: defaultAnswers.stripeSecretKey,
            when: (answers) => answers.useSubscriptions
          },
          {
            name: 'stripePublishableKey',
            message: 'Stripe Publishable Key',
            type: 'input',
            required: true,
            askAnswered: true,
            default: defaultAnswers.stripePublishableKey,
            when: (answers) => answers.useSubscriptions
          }
        ],
        defaultAnswers
      );

      const {
        stripeSecretKey,
        stripePublishableKey,
        hubspotApiKey,
        syncWithHubspot,
        useSubscriptions,
        requireSubscription
      } = answers;

      if (useSubscriptions) {
        await ssm.setParam(`shared/stripe`, {
          secretKey: stripeSecretKey,
          publishableKey: stripePublishableKey
        });
      } else {
        await ssm.deleteParam(`shared/stripe`);
      }

      if (syncWithHubspot) {
        await ssm.setParam(`shared/hubspot/hapi-key`, hubspotApiKey);
      } else {
        await ssm.deleteParam(`shared/hubspot/hapi-key`);
      }

      await ssm.setParam(
        `shared/_/require-subscription`,
        requireSubscription === true
      );
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };
};
