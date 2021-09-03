module.exports = (app) => {
  const commentVotes = require('../controllers/commentVote.controller.js');
  const { authJwt } = require('../middleware');

  var router = require('express').Router();

  // Create a new Comment Vote
  router.post('/vote', [authJwt.verifyToken], commentVotes.addVote);

  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );

    next();
  });

  app.use('/api/comment', router);
};
