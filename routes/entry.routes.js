module.exports = (app) => {
  const entries = require('../controllers/entry.controller.js');

  var router = require('express').Router();

  // Create a new Entry
  router.post('/', entries.create);

  // Retrieve all Entries
  router.get('/', entries.findAll);

  /*
  // Retrieve all published Tutorials
  router.get('/published', tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get('/:id', tutorials.findOne);

  // Update a Tutorial with id
  router.put('/:id', tutorials.update);

  // Delete a Tutorial with id
  router.delete('/:id', tutorials.delete);

  // Delete all Tutorials
  router.delete('/', tutorials.deleteAll);
  */

  app.use('/api/entries', router);
};
