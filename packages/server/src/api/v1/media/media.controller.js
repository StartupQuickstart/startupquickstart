import http from 'http';
import ApiController from '@/lib/api-controller';
import models from '@/api/models';
import fs from 'fs';
import formidable from 'formidable';
import Aws from 'aws-sdk';

class MediaController extends ApiController {
  constructor() {
    super(models.Media);
    this.includes = ['account'];
  }

  /**
   * Creates a media record and uploads file to s3
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async create(req, res, next) {
    const transaction = await models.Media.sequelize.transaction();

    try {
      const form = formidable({ multiples: false });

      const file = await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
          if (err) reject(err);
          return resolve(files.files);
        });
      });

      const filePath = file.path;
      const fileName = file.name;
      const fileType = file.type;

      const media = new models.Media({
        account_id: req.user.account_id,
        name: fileName,
        type: fileType,
        description: fileType
      });
      media.path = `media/${media.id}/${fileName}`;
      await media.save({ transaction });

      const fileData = fs.readFileSync(filePath);

      const s3 = new Aws.S3();
      await s3
        .putObject({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: media.path,
          Body: fileData
        })
        .promise();

      if (req.query.project_id) {
        const project = await models.Project.findOne({
          where: { id: req.query.project_id }
        });

        await project.addMedia(media, { transaction });
      }

      await transaction.commit();

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(media.id);
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  }

  /**
   * Deletes a media record and uploads a file to s3
   *
   * @param {HttpRequest} req Http request to handle
   * @param {HttpResponse} res Http response to send
   */
  async delete(req, res, next) {
    try {
      const mediaId = typeof req.body === 'string' ? req.body : req.body.id;

      const media = await models.Media.findOne({ where: { id: mediaId } });

      if (!media) {
        return res.status(404).send(http.STATUS_CODES[404]);
      }

      const s3 = new Aws.S3();
      await s3
        .deleteObject({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: media.path
        })
        .promise();

      await media.destroy();

      return res.status(200).send(http.STATUS_CODES[200]);
    } catch (err) {
      next(err);
    }
  }
}

export default new MediaController();
