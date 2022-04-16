import * as yup from 'yup';

export const orderSchema = yup
  .mixed()
  .transform((currentValue) => currentValue.toUpperCase())
  .oneOf(['ASC', 'DESC']);

export const countSchema = (model) => {
  return yup.object({
    query: {
      filter: yup.object()
    }
  });
};

export const indexSchema = (model) => {
  const fieldNames = Object.keys(model.rawAttributes);
  const fieldSchema = yup.mixed().oneOf(fieldNames);

  return yup.object({
    query: yup.object({
      filter: yup.object(),
      offset: yup.number().min(0),
      limit: yup.number().min(1).max(1000),
      order: yup.array().of(yup.tuple([fieldSchema, orderSchema]))
    })
  });
};

export const readSchema = (model) => {
  return yup.object({
    params: { id: yup.string().required() }
  });
};

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};
