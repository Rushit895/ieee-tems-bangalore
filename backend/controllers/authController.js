const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ADMINS = [
  {
    username: process.env.ADMIN_USER_1,
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASS_1, 10),
  },
  {
    username: process.env.ADMIN_USER_2,
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASS_2, 10),
  },
];

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const admin = ADMINS.find((a) => a.username === username);
  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username });
};

module.exports = { login };
