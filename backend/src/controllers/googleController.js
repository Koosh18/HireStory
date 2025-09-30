const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { z } = require('zod');
const User = require('../models/User');

const googleLoginSchema = z.object({
  body: z.object({ idToken: z.string().min(1) }),
});

async function googleLogin(req, res, next) {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ error: 'Google sign-in temporarily unavailable' });
    }
    const { idToken } = req.validated.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const googleId = payload.sub;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, password: '' });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(401).json({ error: 'Google sign-in failed' });
  }
}

module.exports = { googleLogin, googleLoginSchema };
