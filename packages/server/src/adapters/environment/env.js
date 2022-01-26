import dotenv from 'dotenv';

dotenv.config();

export async function load(config) {
  console.log('Loading environment config from ENV.');

  const envConfig = {
    enc: {
      secret: process.env.SECRET || 'neLCtCZf3S3fnjuWuOiEp58T6dQcZuUq'
    },
    database: {
      dbname: process.env.DATABASE_NAME || 'startupquickstart',
      engine: 'postgres',
      port: process.env.DATABASE_PORT || 5432,
      host: process.env.DATABASE_HOST || 'localhost',
      username: process.env.DATABASE_USERNAME || 'startupquickstart_svc_app',
      password:
        process.env.DATABASE_PASSWORD || 'startupquickstart_svc_app_pass'
    },
    google: {
      user: process.env.GOOGLE_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    },
    hubspot: {
      apiKey: process.env.HUBSPOT_API_KEY
    },
    stripe: {
      apiKey: process.env.STRIPE_API_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    }
  };

  for (const key in envConfig) {
    if (config[key]) {
      config[key] = { ...config[key], ...envConfig[key] };
    } else {
      config[key] = envConfig[key];
    }
  }

  return config;
}
