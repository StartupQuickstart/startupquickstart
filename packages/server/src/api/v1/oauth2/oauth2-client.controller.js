import http from 'http';
import ApiController from '@/lib/api-controller';
import models from '@/api/models';

class OAuth2ClientController extends ApiController {
  constructor() {
    super(models.OAuth2Client);
  }
}

export default new OAuth2ClientController();
