#!/usr/bin/env node

const cli = require('commander');
const pkg = require('../package.json');
const shell = require('shelljs');

cli
  .command('start')
  .description('Starts the express server')
  .action(async () => shell.exec(`TZ=UTC node ./dist/app.js`));

cli
  .command('build')
  .description('Builds the code for production')
  .action(async () =>
    shell.exec(
      `rm -rf ./dist && NODE_ENV=production babel ./src  --ignore ./src/admin-client,./src/bin --out-dir dist`
    )
  );

cli
  .command('dev:start')
  .description('Starts the development express server')
  .action(async () =>
    shell.exec(`TZ=UTC PORT=3001 nodemon --exec babel-node ./src/app.js`)
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
  .action(async () => shell.exec(`npm start --prefix src/admin-client`));

cli
  .command('db:migrate')
  .description('Runs the database migration')
  .action(async () => shell.exec(`npx sequelize-cli db:migrate --env default`));

cli
  .command('db:seed')
  .description('Runs the database seed')
  .action(async () =>
    shell.exec(`npx sequelize-cli db:seed:all --env default`)
  );

cli
  .command('db:migration <name>')
  .description('Creates a database migration')
  .action(async (name) =>
    shell.exec(`npx sequelize-cli migration:generate --name ${name}`)
  );

try {
  cli.parse(process.argv);
} catch (err) {
  cli.outputHelp();
}

if (process.argv.length === 2) {
  cli.outputHelp();
}