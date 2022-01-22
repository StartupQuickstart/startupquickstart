import nodemailer from 'nodemailer';
import ReactDOMServer from 'react-dom/server';
import juice from 'juice';
// eslint-disable-next-line
import React from 'react';
const { google } = require('googleapis');
import fs from 'fs';
import path from 'path';
import AwsParamStore from '@/lib/aws/param-store';

export default class Mailer {
  /**
   * Gets the amil template for the templat ename
   *
   * @param {String} name Name of the mail template
   */
  static getEmailTemplate(name) {
    const coreTemplatePath = path.resolve(
      __dirname,
      `../emails/templates/${name}`
    );
    const appTemplatePath = path.resolve(
      __dirname,
      `../../emails/templates/${name}`
    );

    if (fs.existsSync(appTemplatePath)) {
      return require(appTemplatePath).default;
    } else {
      return require(coreTemplatePath).default;
    }
  }

  /**
   * Gets the transporter for an email
   */
  static async getTransporter() {
    const config = await AwsParamStore.getByPath('/shared/google/');

    const oAuth2Client = new google.auth.OAuth2(
      config['client-id'],
      config['client-secret']
    );

    oAuth2Client.setCredentials({ refresh_token: config['refresh-token'] });

    const tokens = await oAuth2Client.refreshAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config['user'],
        clientId: config['client-id'],
        clientSecret: config['client-secret'],
        refreshToken: config['refresh-token'],
        accessToken: tokens.access_token
      }
    });

    return transporter;
  }

  /**
   * Checks to see if the email is a valid email
   *
   * @param {String} email Email address to check to see if valid
   */
  static isValidEmail(email) {
    return /^\w+([.\-+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(email);
  }

  /**
   * Renders an email
   *
   * @param {String} templateName Template to render
   * @param {Object} data         Data for the template
   */
  static async renderEmail(templateName, data) {
    data.host = process.env.PUBLIC_HOST || process.env.HOST;

    function renderEmail(emailComponent, isHtml = true) {
      const doctype =
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"' +
        ' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
      const content = ReactDOMServer.renderToStaticMarkup(emailComponent);
      return isHtml ? doctype + content : content;
    }

    // eslint-disable-next-line
    const EmailTemplate = this.getEmailTemplate(templateName);

    const html = juice(
      renderEmail(<EmailTemplate renderAs="html" data={data} />)
    );
    const text = renderEmail(
      <EmailTemplate renderAs="text" data={data} />,
      false
    );

    return {
      html,
      text
    };
  }

  /**
   * Sends an email
   *
   * @param {String} templateName Template to send
   * @param {Object} data         Data for the template
   * @param {object} options      Options for the email
   */
  static async send(templateName, data = {}, options = {}) {
    const { html, text } = await this.renderEmail(templateName, data);

    const email = {
      ...options,
      html,
      text
    };

    const transporter = await this.getTransporter();
    return await transporter.sendMail(email);
  }
}
