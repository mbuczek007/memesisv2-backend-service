module.exports = (app) => {
  const entries = require('../controllers/entry.controller.js');
  const fileUpload = require('express-fileupload');
  const { authJwt } = require('../middleware');

  const router = require('express').Router();

  // Create a new Entry
  router.post(
    '/add',
    fileUpload({
      limits: { fileSize: 1 * 1024 * 1024 }, // 1mb
      abortOnLimit: true,
    }),
    [authJwt.verifyToken],
    entries.create
  );

  // Retrieve all Entries
  router.get('/', entries.findAll);

  // Retrieve all restricted Entries
  router.get(
    '/restricted/',
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    entries.findAllRestricted
  );

  // Retrieve a single Entry with id
  router.get('/:id', entries.findOne);

  // Delete a Entry with id
  router.delete(
    '/delete/:id',
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    entries.delete
  );

  // Accept a Entry with id
  router.put(
    '/accept/:id',
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    entries.accept
  );

  // Reject a Entry with id
  router.put(
    '/reject/:id',
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    entries.reject
  );

  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );

    next();
  });

  app.use('/api/entries', router);
};
