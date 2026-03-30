const { users } = require('../data/store');

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

exports.getAllUsers = (req, res) => {
  return res.status(200).json(users.map(sanitizeUser));
};

exports.getUserById = (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.status(200).json(sanitizeUser(user));
};

exports.updateUser = (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { first_name, last_name, role } = req.body;

  if (first_name !== undefined) user.first_name = first_name;
  if (last_name !== undefined) user.last_name = last_name;
  if (role !== undefined) user.role = role;

  return res.status(200).json(sanitizeUser(user));
};

exports.deleteUser = (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  users.splice(index, 1);
  return res.status(204).send();
};