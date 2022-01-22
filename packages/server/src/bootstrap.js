import path from 'path';
import server from '@/server';

(() => {
  server.start();

  server.registerClient(path.resolve(__dirname, './test-client/build'));
})();
