(() => {
  const { ObjectId } = require('mongodb');
  const config = require('../server/config/config');
  const backup = require('../models/backup/backup.json');
  const { getDB } = require('../server/database');
  const Review = require('../models/review');

  const createReview = (category) => async (req, res) => {
    const { title, image, creator, review, rating } = req.body;

    if (!title || !review || !rating)
      return res.status(400).json({ error: 'Missing required fields' });

    const reviewer = req.session.user.name;

    const newReview = Review(
      title,
      review,
      rating,
      req.session.user._id,
      reviewer,
      new Date()
    );
    newReview.image = image;
    newReview.creator = creator;
    newReview.category = category;
    

    try {
      const db = getDB();
      const result = await db.collection('reviews').insertOne(newReview);
      res.status(201).json({ message: `${category[0].toUpperCase() + category.slice(1)} review posted`, id: result.insertedId });
    } catch (err) {
      console.error('Error posting review:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const getAllReviews = (category = '') => async (req, res) => {
    try {
      const db = getDB();
      const query = category ? { category } : {};
      const reviews = await db.collection('reviews').find(query).toArray();
      res.json(reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  };

  const deleteReview = async (req, res) => {
    try {
      const db = getDB();
      await db.collection('reviews').deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: 'Review deleted' });
    } catch (err) {
      console.error('Error deleting review:', err);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  };

  const updateReview = async (req, res) => {
    const { title, review } = req.body;
    try {
      const db = getDB();
      await db.collection('reviews').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { title, review } }
      );
      res.json({ message: 'Review updated' });
    } catch (err) {
      console.error('Error updating review:', err);
      res.status(500).json({ error: 'Failed to update review' });
    }
  };

  const fetchBookResults = async (req, res) => {
    const title = req.body.query;
    const fetchQuery = title.split(' ').join('+');
    const url = `${config.OPEN_LIBRARY_API}${fetchQuery}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(200).json(backup);
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching book results:', err);
      res.status(500).json({ error: 'Failed to fetch book results' });
    }
  };

  const fetchBookCoverURL = async (req, res) => {
    const imageId = req.params.imageId;
    const coverUrl = `${config.OPEN_LIBRARY_COVER_API}${imageId}`;
    res.status(200).json({ coverUrl });
  };

  module.exports = {
    getAllReviews: getAllReviews(),
    createReview: createReview(''),
    deleteReview,
    updateReview,
    getFilmReviews: getAllReviews('film'),
    createFilmReview: createReview('film'),
    getBookReviews: getAllReviews('book'),
    createBookReview: createReview('book'),
    fetchBookResults,
    fetchBookCoverURL,
  };
})();
