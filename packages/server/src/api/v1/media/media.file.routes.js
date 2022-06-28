import http from 'http';
import Auth from '@/lib/auth';
import express from 'express';
import Aws from 'aws-sdk';
import models from '@/api/models';

const s3 = new Aws.S3();

const router = express.Router();

router.get(
  '/:mediaId/:filename',
  Auth.protected({ strategies: ['jwtCookie'] }),
  async function (req, res, next) {
    const media = await models.Media.findOne({
      where: { id: req.params.mediaId, name: req.params.filename }
    });

    try {
      new Promise((resolve, reject) => {
        const fileStream = s3
          .getObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `media/${req.params.mediaId}/${req.params.filename}`
          })
          .createReadStream();

        fileStream.on('error', (err) => {
          if (err.statusCode) {
            resolve();
            return res
              .status(err.statusCode)
              .send(http.STATUS_CODES[err.statusCode]);
          } else {
            reject(err);
          }
        });

        res.set('Content-Type', media.type);

        return fileStream.pipe(res);
      });
    } catch (err) {
      return res.status(500).send(http.STATUS_CODES[500]);
    }
  }
);

router.get(
  '/download/:mediaId/:filename',
  Auth.protected({ strategies: ['jwtCookie'] }),
  async function (req, res, next) {
    const media = await models.Media.findOne({
      where: { id: req.params.mediaId, name: req.params.filename }
    });

    try {
      new Promise((resolve, reject) => {
        const fileStream = s3
          .getObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `media/${req.params.mediaId}/${req.params.filename}`
          })
          .createReadStream();

        fileStream.on('error', (err) => {
          if (err.statusCode) {
            resolve();
            return res
              .status(err.statusCode)
              .send(http.STATUS_CODES[err.statusCode]);
          } else {
            reject(err);
          }
        });

        res.setHeader(
          'Content-disposition',
          'attachment; filename=' + media.name
        );
        res.set('Content-Type', media.type);

        return fileStream.pipe(res);
      });
    } catch (err) {
      return res.status(500).send(http.STATUS_CODES[500]);
    }
  }
);

export default router;
