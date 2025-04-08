// server/routes.js
(() => {
    const express = require('express');
    const path = require('path');
    const router = express.Router();
  
    const { isAdmin, isMember } = require('../middleware/auth');
    const authController = require('../controllers/authController');
    const reviewController = require('../controllers/reviewController');
  
    // === API ROUTES ===
    router.post('/getBookTitles', reviewController.fetchBookResults);
    router.get('/getBookCover/:imageId', reviewController.fetchBookCoverURL);

    // === AUTH ROUTES ===
    router.get('/auth/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'login.html')));
    router.get('/auth/register', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'register.html')));
    router.post('/auth/register', authController.register);
    router.post('/auth/login', authController.login);
    router.get('/auth/logout', authController.logout);
  
    // === REVIEW ROUTES ===
    router.get('/reviews', reviewController.getAllReviews);
    router.post('/reviews', isMember, reviewController.createReview);
    router.delete('/reviews/:id', isAdmin, reviewController.deleteReview);
    router.put('/reviews/:id', isAdmin, reviewController.updateReview);
  
    // === FILM REVIEWS ===
    router.get('/films', reviewController.getFilmReviews);
    router.post('/films', isMember, reviewController.createFilmReview);
    router.delete('/films/:id', isAdmin, reviewController.deleteFilmReview);
    router.put('/films/:id', isAdmin, reviewController.updateFilmReview);
  
    // === BOOK REVIEWS ===
    router.get('/books', reviewController.getBookReviews);
    router.post('/books', isMember, reviewController.createBookReview);
    router.delete('/books/:id', isAdmin, reviewController.deleteBookReview);
    router.put('/books/:id', isAdmin, reviewController.updateBookReview);
  
    module.exports = router;
  })();
  