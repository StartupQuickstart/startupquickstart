#!/usr/bin/env node

const cli = require('commander');
const pkg = require('../package.json');
const shell = require('shelljs');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const dotenv = require('dotenv');

cli
  .version(pkg.version)
  .option('-e, --env [env]', 'Environment to use', 'prod');

dotenv.config();

function initSequelize() {
  const config = require('../.sequelizerc');

  if (!fs.existsSync(config['seeders-path'])) {
    fs.mkdirSync(config['seeders-path']);
  }

  if (!fs.existsSync(config['migrations-path'])) {
    fs.mkdirSync(config['migrations-path']);
  }

  for (const seedFile of glob.sync(path.resolve(__dirname, '../seeds/**/*'))) {
    const fileName = file.split('/').pop();
    fs.copyFileSync(file, path.resolve(config['seeders-path'], fileName));
  }

  for (const file of glob.sync(path.resolve(__dirname, '../migrations/**/*'))) {
    const fileName = file.split('/').pop();
    fs.copyFileSync(file, path.resolve(config['migrations-path'], fileName));
  }
}

cli
  .command('start')
  .description('Starts the express server')
  .action(async () =>
    shell.exec(` NODE_ENV=production TZ=UTC node ./dist/app.js`)
  );

cli
  .command('build')
  .description('Builds the code for production')
  .action(async () =>
    shell.exec(
      `
        rm -rf ./dist && NODE_ENV=production babel ./src  --ignore ./src/client,./src/bin --out-dir dist
        npm run build --prefix ./src/client
        mkdir -p ./dist/client
        cp -r ./src/client/build ./dist/client/build
      `
    )
  );

cli
  .command('dev')
  .description('Starts the development express server')
  .action(async () =>
    shell.exec(
      `TZ=UTC PORT=3501 nodemon --exec babel-node --ignore ./src/client ./src/app.js`
    )
  );

cli
  .command('dev:db')
  .description('Starts the development database (Docker Required)')
  .action(async () => shell.exec(`docker-compose up -d postgres`));

cli
  .command('dev:db:stop')
  .description('Stops the development database (Docker Required)')
  .action(async () => shell.exec(`docker-compose down`));

cli
  .command('dev:client')
  .description(
    'Starts the development client if installed (See: @startupquickstart/react)'
  )
  .action(async () => shell.exec(`npm start --prefix src/client`));

cli
  .command('db:migrate')
  .description('Runs the database migration')
  .action(async () => {
    initSequelize();
    shell.exec(
      `cd ./node_modules/@startupquickstart/server && npx sequelize-cli db:migrate --env default`
    );
  });

cli
  .command('db:seed')
  .description('Runs the database seed')
  .action(async () => {
    initSequelize();
    shell.exec(
      `cd ./node_modules/@startupquickstart/server && npx sequelize-cli db:seed:all --env default`
    );
  });

cli
  .command('db:migration <name>')
  .description('Creates a database migration')
  .action(async (name) => {
    initSequelize();
    shell.exec(
      `cd ./node_modules/@startupquickstart/server && npx sequelize-cli migration:generate --name ${name}`
    );
  });

cli
  .command('setup:secret')
  .description('Sets the app secret for the environment in aws')
  .action(async (name) => {
    const cmd = require('./commands/set-secret');
    await cmd(cli)();
  });

cli
  .command('setup:gmail')
  .description('Sets up google mail for transactional emails')
  .option('-f --force', 'Whether or not to force a fresh setup.')
  .action(async (options) => {
    const cmd = require('./commands/setup-gmail');
    await cmd(cli)(options);
  });

try {
  cli.parse(process.argv);
} catch (err) {
  cli.outputHelp();
}

if (process.argv.length === 2) {
  cli.outputHelp();
}
