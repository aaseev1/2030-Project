(() => {
  const { getDB } = require('../server/database');
  const { ObjectId } = require('mongodb');

  const collection = () => getDB().collection('reviews');

  const Review = {
    getByCategory: async (cat) =>
      cat === 'reviews'
        ? await collection().find().toArray()
        : await collection().find({ category: cat.slice(0, -1) }).toArray(),

    create: async (review) => await collection().insertOne(review),

    update: async (id, update) =>
      await collection().updateOne({ _id: new ObjectId(id) }, { $set: update }),

    delete: async (id) => await collection().deleteOne({ _id: new ObjectId(id) }),
  };

  module.exports = Review;
})();