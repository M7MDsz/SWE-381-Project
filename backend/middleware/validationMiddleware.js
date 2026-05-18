const requireFields = (fields) => (req, res, next) => {
  const missingFields = fields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    res.status(400);
    return next(new Error(`Missing required fields: ${missingFields.join(', ')}`));
  }

  next();
};

module.exports = { requireFields };
