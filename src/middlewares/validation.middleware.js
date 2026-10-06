export const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Datos inválidos",
        errors: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Parámetros inválidos",
        errors: result.error.issues,
      });
    }

    req.params = result.data;

    next();
  };
};