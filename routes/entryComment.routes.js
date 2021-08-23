module.exports = (app) => {
  const Comments = require('../controllers/entryComment.controller.js');

  var router = require('express').Router();

  // Create a new Comment
  router.post('/add', Comments.createComment);

  // Retrieve all comments for Entry id
  router.get('/:id', Comments.getComments);

  app.use('/api/comments', router);
};
