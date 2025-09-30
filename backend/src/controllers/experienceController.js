const { z } = require('zod');
const Experience = require('../models/Experience');

const createExperienceSchema = z.object({
  body: z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    year: z.number().int().min(1900).max(3000),
    verdict: z.enum(['awaiting', 'accepted', 'rejected']).optional().default('awaiting'),
    rounds: z.array(z.string()).optional().default([]),
    problems: z.array(z.string().url()).optional().default([]),
    tips: z.string().optional().default(''),
    anonymous: z.boolean().optional().default(false),
  }),
});

const listExperiencesSchema = z.object({
  query: z.object({
    company: z.string().optional(),
    role: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.enum(['recent', 'oldest', 'company']).optional(),
  }).optional().default({}),
});

const getExperienceSchema = z.object({
  params: z.object({ id: z.string().length(24) }),
});

async function createExperience(req, res, next) {
  try {
    const { company, role, year, verdict, rounds, problems, tips, anonymous } = req.validated.body;
    const experience = await Experience.create({
      company,
      role,
      year,
      verdict,
      rounds,
      problems,
      tips,
      anonymous,
      author: req.user.id,
    });
    res.status(201).json(experience);
  } catch (err) {
    next(err);
  }
}

async function listExperiences(req, res, next) {
  try {
    const { company, role, page = '1', limit = '10', sort = 'recent' } = req.validated.query || {};
    const filter = {};
    if (company) filter.company = company;
    if (role) filter.role = role;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    let sortSpec = { createdAt: -1 };
    if (sort === 'oldest') sortSpec = { createdAt: 1 };
    if (sort === 'company') sortSpec = { company: 1, createdAt: -1 };
    const total = await Experience.countDocuments(filter);
    const items = await Experience.find(filter)
      .select('company role year verdict rounds problems tips anonymous author createdAt')
      .populate('author', 'name email')
      .sort({ createdAt: sortSpec.createdAt || -1, _id: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    const totalPages = Math.max(1, Math.ceil(total / limitNum));
    res.json({ items, total, totalPages, page: pageNum, pageSize: limitNum });
  } catch (err) {
    next(err);
  }
}

async function getExperience(req, res, next) {
  try {
    const { id } = req.validated.params;
    const item = await Experience.findById(id).populate('author', 'name email');
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createExperience,
  listExperiences,
  getExperience,
  createExperienceSchema,
  listExperiencesSchema,
  getExperienceSchema,
};


