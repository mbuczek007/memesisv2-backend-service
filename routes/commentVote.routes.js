module.exports = (app) => {
  const commentVotes = require('../controllers/commentVote.controller.js');

  var router = require('express').Router();

  // Create a new Comment Vote
  router.post('/vote', commentVotes.addVote);

  app.use('/api/comment', router);
};
