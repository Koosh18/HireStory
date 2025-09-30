const express = require('express');
const { validate } = require('../middleware/validate');
const { googleLogin, googleLoginSchema } = require('../controllers/googleController');

const router = express.Router();

router.post('/google', validate(googleLoginSchema), googleLogin);

module.exports = router;
