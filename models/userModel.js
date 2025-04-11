const User = (name, username, password, role = 'member') => {
  return {
    name,
    username,
    password,
    role,
    createdAt: new Date()
  };
};

module.exports = User;
