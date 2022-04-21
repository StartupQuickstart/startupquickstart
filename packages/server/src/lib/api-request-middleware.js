import models from '@/api/models';

export const apiQueryParser = (modelName) => {
  return (req, res, next) => {
    if (typeof req.query.filter === 'string') {
      try {
        req.query.filter = JSON.parse(req.query.filter);
      } catch (err) {}
    }

    if (typeof req.query.filter !== 'object') {
      req.query.filter = {};
    }

    if (models[modelName].rawAttributes.account_id && req.user) {
      req.query.filter.account_id = req.user.account.id;
    }

    if (req.query.order) {
      req.query.order = parseJson(req.query.order);
    }

    return next();
  };
};

export const parseJson = (json) => {
  try {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }

    if (typeof json === 'object') {
      for (let key in json) {
        if (typeof json[key] === 'string') {
          json[key] = parseJson(json[key]);
        }
      }
    }

    if (Array.isArray(json)) {
      json = json.map(parseJson);
    }
  } catch (err) {}

  return json;
};
