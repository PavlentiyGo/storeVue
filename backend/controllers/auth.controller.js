const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { users, refreshTokens } = require('../data/store');

const ACCESS_TOKEN_SECRET = 'your-very-secret-key-for-jwt';
const REFRESH_TOKEN_SECRET = 'your-super-secret-key-for-refresh-jwt';

exports.register = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !first_name || !last_name || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = users.find((u) => u.email === email);
    if (exists) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      id: uuidv4(),
      email,
      first_name,
      last_name,
      password: passwordHash,
      role: 'user',
    };

    users.push(user);

    return res.status(201).json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    });
  } catch (e) {
    console.error('REGISTER ERROR:', e); // важно для диагностики
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    refreshTokens.add(refreshToken);

    return res.status(200).json({ accessToken, refreshToken });
  } catch (e) {
    console.error('LOGIN ERROR:', e);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

exports.refresh = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' });
    if (!refreshTokens.has(refreshToken)) return res.status(403).json({ message: 'Invalid refresh token' });

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    refreshTokens.delete(refreshToken);

    const payload = { sub: decoded.sub, email: decoded.email, role: decoded.role };
    const newAccessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    refreshTokens.add(newRefreshToken);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (e) {
    console.error('REFRESH ERROR:', e);
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

exports.getMe = (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.sub);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    });
  } catch (e) {
    console.error('ME ERROR:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};