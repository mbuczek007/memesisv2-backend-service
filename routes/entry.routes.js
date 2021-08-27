module.exports = (app) => {
  const entries = require('../controllers/entry.controller.js');

  var router = require('express').Router();

  // Create a new Entry
  router.post('/add', entries.create);

  // Retrieve all Entries
  router.get('/', entries.findAll);

  // Retrieve a single Entry with id
  router.get('/:id', entries.findOne);

  // Delete a Entry with id
  router.delete('/delete/:id', entries.delete);

  // Accept a Entry with id
  router.put('/accept/:id', entries.accept);

  // Reject a Entry with id
  router.put('/reject/:id', entries.reject);

  app.use('/api/entries', router);
};
