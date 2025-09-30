const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createExperience,
  listExperiences,
  getExperience,
  createExperienceSchema,
  listExperiencesSchema,
  getExperienceSchema,
} = require('../controllers/experienceController');

const router = express.Router();

router.post('/', requireAuth, validate(createExperienceSchema), createExperience);
router.get('/', validate(listExperiencesSchema), listExperiences);
router.get('/:id', validate(getExperienceSchema), getExperience);

module.exports = router;
