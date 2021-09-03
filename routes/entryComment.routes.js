module.exports = (app) => {
  const Comments = require('../controllers/entryComment.controller.js');
  const { authJwt } = require('../middleware');

  var router = require('express').Router();

  // Create a new Comment
  router.post('/add', [authJwt.verifyToken], Comments.createComment);

  // Retrieve all comments for Entry id
  router.get('/:id', Comments.getComments);

  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );

    next();
  });

  app.use('/api/comments', router);
};
