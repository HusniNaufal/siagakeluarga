// Validasi zod untuk body/params/query. Hasil parse tersedia di req.validated
// (req.query bersifat read-only di Express 5, jadi tidak ditimpa).
export const validate = (schemas) => (req, res, next) => {
  const validated = {};
  const errors = [];

  for (const key of ['body', 'params', 'query']) {
    if (!schemas[key]) continue;
    const result = schemas[key].safeParse(req[key] ?? {});
    if (result.success) {
      validated[key] = result.data;
    } else {
      for (const issue of result.error.issues) {
        errors.push({ field: [key, ...issue.path].join('.'), message: issue.message });
      }
    }
  }

  if (errors.length) {
    return res.status(400).json({ success: false, message: 'Validasi gagal', errors });
  }

  req.validated = validated;
  if (validated.body) req.body = validated.body;
  next();
};
