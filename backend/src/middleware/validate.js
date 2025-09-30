function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const messages = [
        ...(flat.formErrors || []),
        ...Object.values(flat.fieldErrors || {}).flat(),
      ].filter(Boolean);
      const message = messages.length ? messages[0] : 'Invalid request';
      return res.status(400).json({ error: message });
    }
    // attach parsed data if needed
    req.validated = parsed.data;
    next();
  };
}

module.exports = { validate };


