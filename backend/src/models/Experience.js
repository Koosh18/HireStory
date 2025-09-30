const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    verdict: { type: String, enum: ['awaiting', 'accepted', 'rejected'], default: 'awaiting' },
    rounds: { type: [String], default: [] },
    problems: { type: [String], default: [] },
    tips: { type: String, default: '' },
    anonymous: { type: Boolean, default: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

ExperienceSchema.index({ company: 1 });
ExperienceSchema.index({ role: 1 });
ExperienceSchema.index({ createdAt: -1, _id: -1 });

module.exports = mongoose.model('Experience', ExperienceSchema);


