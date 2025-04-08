(() => {
  const { getDB } = require('../server/database');
  const bcrypt = require('bcrypt');
  const path = require('path');

  const servePage = (filename) => (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'views', filename));

  const register = async (req, res) => {
    const { name, username, password, role = 'member' } = req.body;
    const db = getDB();

    if (!password || password.length < 8 || password.length > 20)
      return res.status(400).json({ error: 'Password must be 8-20 characters long' });

    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ name, username, password: hashedPassword, role });

    res.status(201).json({ message: 'Registration successful' });
  };

  const login = async (req, res) => {
    const { username, password } = req.body;
    const db = getDB();
    const user = await db.collection('users').findOne({ username });
    console.log('------------------------')
    console.log('------------------------')
    console.log('\nUser:', user);
    console.log('Entered password:', password);
    const match = await bcrypt.compare(password, user.password);
    console.log('Match result:', match);
    
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    req.session.user = {
      _id: user._id,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    res.json({ message: 'Login successful', user: req.session.user });
  };

  const logout = (req, res) => req.session.destroy(() => res.json({ message: 'Logged out' }));

  module.exports = {
    serveLogin: servePage('login.html'),
    serveRegister: servePage('register.html'),
    register,
    login,
    logout,
  };
})();