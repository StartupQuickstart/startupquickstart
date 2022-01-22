import http from 'http';
import models from '@/api/models';

class AuthController {
  constructor() {
    this.refresh = this.refresh.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  /**
   * Activates a user
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http respone to send
   */
  async activate(req, res) {
    try {
      if (!req.body.activationCode) {
        return res.status(400).send({
          success: false,
          message: 'activationCode is required.',
          code: 'MISSING_CODE'
        });
      }

      await req.user.activate(req.body.activationCode);

      res.status(200).send(http.STATUS_CODES[200]);
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: 'Failed to send reset password link.',
        code: 'UNKNOWN_ERROR'
      });
    }
  }

  /**
   * Authorizes a user
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http respone to send
   */
  async authorize(req, res) {
    if (!req.user) {
      return res.status(401).send(http.STATUS_CODES[401]);
    }

    req.user.last_active_at = new Date();
    req.user.save();

    const token = await req.user.getToken(['api']);
    res
      .status(200)
      .send({ token, setupProgress: await req.user.getSetupProgress() });
  }

  /**
   * Sends a forget password email
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http respone to send
   */
  async forgotPassword(req, res) {
    try {
      if (!req.body.email) {
        return res.status(400).send({
          success: false,
          message: 'email is required.',
          code: 'MISSING_CODE'
        });
      }

      await models.User.sendResetPasswordLink(req.body.email);

      res.status(200).send(http.STATUS_CODES[200]);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: 'Failed to send reset password link.',
        code: 'UNKNOWN_ERROR'
      });
    }
  }

  /**
   * Refreshes the users login session
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http respone to send
   */
  async refresh(req, res) {
    const token = await req.user.getToken(req.user.scope);
    res
      .status(200)
      .send({ token, setupProgress: await req.user.getSetupProgress() });
  }

  /**
   * Resets a users password
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http respone to send
   */
  async resetPassword(req, res) {
    try {
      if (!req.body.password) {
        return res.status(400).send({
          success: false,
          message: 'Failed to reset password.',
          code: 'MISSING_PASSWORD'
        });
      }

      const shouldSendToken = req.user.invite_pending;

      await req.user.setPassword(req.body.password);

      if (shouldSendToken) {
        const token = await req.user.getToken(['api']);
        return res
          .status(200)
          .send({ token, setupProgress: await req.user.getSetupProgress() });
      } else {
        res.status(200).send(http.STATUS_CODES[200]);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        message: 'Failed to reset password.',
        code: 'UNKNOWN_ERROR'
      });
    }
  }

  /**
   * Sends an activate email
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http respone to send
   */
  async sendActivationEmail(req, res) {
    await req.user.sendActivationEmail();
    res.status(200).send(http.STATUS_CODES[200]);
  }

  /**
   * Signs a user up
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponst} res Http respone to send
   */
  async signup(req, res) {
    try {
      const data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        company: req.body.company,
        email: req.body.email.toLowerCase().trim(),
        password: req.body.password
      };

      let user = await models.User.findOne({
        where: { email: data.email },
        raw: true
      });

      if (user) {
        return res.status(400).send({
          message: 'There is already a user with that email.',
          code: 11000
        });
      }

      user = await models.User.signup(data);
      const token = await user.getToken(['api']);

      return res.status(200).send({ token });
    } catch (err) {
      console.log(err);
      res.status(500).send(http.STATUS_CODES[500]);
    }
  }
}

export default new AuthController();
