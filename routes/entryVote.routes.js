module.exports = (app) => {
  const entryVotes = require('../controllers/entryVote.controller.js');

  var router = require('express').Router();

  // Create a new Entry Vote
  router.post('/vote', entryVotes.addVote);

  app.use('/api/entry', router);
};
