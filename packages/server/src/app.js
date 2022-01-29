import path from 'path';
import server from '@/server';

(async () => {
  await server.start();

  server.registerClient(path.resolve(__dirname, './client/build'));
})();
