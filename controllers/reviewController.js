(() => {
  const { getDB } = require('../server/database');
  const { ObjectId } = require('mongodb');

  const createReview = (category) => async (req, res) => {
    const { title, review, rating } = req.body;
    const db = getDB();

    if (!title || !review || !rating)
      return res.status(400).json({ error: 'Missing required fields' });

    await db.collection('reviews').insertOne({
      title,
      review,
      author: req.session.user.name,
      rating,
      category,
      createdAt: new Date(),
    });

    res.status(201).json({ message: `${category[0].toUpperCase() + category.slice(1)} review posted` });
  };

  const getAllReviews = (category = '') => async (req, res) => {
    const db = getDB();
    const query = category ? { category } : {};
    const reviews = await db.collection('reviews').find(query).toArray();
    res.json(reviews);
  };

  const deleteReview = async (req, res) => {
    const db = getDB();
    await db.collection('reviews').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Review deleted' });
  };

  const updateReview = async (req, res) => {
    const db = getDB();
    const { title, review } = req.body;
    await db.collection('reviews').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, review } }
    );
    res.json({ message: 'Review updated' });
  };

  module.exports = {
    getAllReviews: getAllReviews(),
    createReview: createReview(''),
    deleteReview,
    updateReview,
    getFilmReviews: getAllReviews('film'),
    createFilmReview: createReview('film'),
    deleteFilmReview: deleteReview,
    updateFilmReview: updateReview,
    getBookReviews: getAllReviews('book'),
    createBookReview: createReview('book'),
    deleteBookReview: deleteReview,
    updateBookReview: updateReview,
  };
})();