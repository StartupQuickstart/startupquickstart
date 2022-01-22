import Controller from './media.controller';
import Auth from '@/lib/auth';
import ApiRouter from '@/lib/api-route';

const router = new ApiRouter('media', Controller, 'Media', [
  'index',
  'get',
  'create'
]);

router.delete('/media', Auth.protected(), Controller.delete);

export default router;
