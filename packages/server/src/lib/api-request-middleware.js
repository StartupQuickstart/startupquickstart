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
      req.query.order = req.query.order.map((order) => {
        return Array.isArray(order) ? order : JSON.parse(order);
      });
    }

    return next();
  };
};
