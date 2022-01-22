import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User } from '@/api/models';

const options = { usernameField: 'email', passwordField: 'password' };

export default () => {
  passport.use(
    new LocalStrategy(options, async (email, password, done) => {
      const user = await User.findOne({
        where: { email, is_deactivated: false },
        attributes: { include: 'password' }
      }).catch((err) => {
        return done(err, false);
      });

      if (user && (await user.verifyPassword(password))) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  );
};
