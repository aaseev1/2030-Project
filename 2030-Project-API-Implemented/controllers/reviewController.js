(() => {
  const { getDB } = require('../server/database');
  const { ObjectId } = require('mongodb');
  const config = require('../server/config/config');
  const backup = require('../models/backup/backup.json');

  const createReview = (category) => async (req, res) => {
    const { title, image, creator, review, rating } = req.body;
    const db = getDB();

    if (!title || !review || !rating)
      return res.status(400).json({ error: 'Missing required fields' });

    await db.collection('reviews').insertOne({
      title,
      image,
      creator,
      review,
      reviewer: req.session.user.name,
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

  const fetchBookResults = async (req, res) => {
    const title = req.body.query;
    const fetchQuery = title.split(' ').join('+');
    const url = `${config.OPEN_LIBRARY_API}${fetchQuery}`;
    const response = await fetch(url);
    if(!response.ok){
      return backup;
    }
    const data = await response.json();
    res.status(200).json(data);
  };

  const fetchBookCoverURL = async (req, res) => {
    const imageId = req.params.imageId;
    const coverUrl = `${config.OPEN_LIBRARY_COVER_API}${imageId}`;
    res.status(200).json({coverUrl: coverUrl});
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
    fetchBookResults: fetchBookResults,
    fetchBookCoverURL: fetchBookCoverURL,
  };
})();