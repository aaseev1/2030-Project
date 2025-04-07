(() => {
  const { getDB } = require('../server/database');
  const collection = () => getDB().collection('users');

  const User = {
    findByUsername: async (username) => await collection().findOne({ username }),
    createUser: async (user) => await collection().insertOne(user),
  };

  module.exports = User;
})();