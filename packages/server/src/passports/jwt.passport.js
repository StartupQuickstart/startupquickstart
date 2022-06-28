import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from '@/config';

export async function jwt() {
  const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      ExtractJwt.fromUrlQueryParameter('token'),
      ExtractJwt.fromBodyField('token')
    ]),
    secretOrKey: config.enc.secret,
    issuer: config.server.host,
    audience: config.server.host
  };

  class JWTScopeStrategy extends JwtStrategy {
    authenticate(req, options) {
      req.scope = options.scope;
      return super.authenticate(req, options);
    }
  }

  passport.use(
    new JWTScopeStrategy(options, async (payload, done) => {
      const models = require('../api/models').default;

      try {
        const user = await models.User.findOne({
          where: { id: payload.sub, is_deactivated: false },
          include: ['account']
        });

        if (user) {
          user.last_active_at = new Date();
          user.save();

          user.scope = payload.scope;
          return done(null, user);
        }
      } catch (err) {
        console.log(err);
      }

      return done(null, false);
    })
  );
}

export default jwt;
