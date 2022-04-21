import OAuthServer from 'express-oauth-server';
import OAuth2 from './oauth2.model';
export { OAuth2 } from './oauth2.model';
import OAuth2Config from './oauth2.config';

export default new OAuthServer({
  model: OAuth2,
  ...OAuth2Config
});
