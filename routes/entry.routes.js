module.exports = (app) => {
  const entries = require('../controllers/entry.controller.js');

  var router = require('express').Router();

  // Create a new Entry
  router.post('/', entries.create);

  // Retrieve all Entries
  router.get('/', entries.findAll);

  // Retrieve all accepted Entries
  router.get('/accepted', entries.findAllAcceptedEntries);

  // Retrieve a single Entry with id
  router.get('/:id', entries.findOne);

  // Delete a Entry with id
  router.delete('/delete/:id', entries.delete);

  /*
  // Update a Tutorial with id
  router.put('/:id', tutorials.update);

  // Delete all Tutorials
  router.delete('/', tutorials.deleteAll);
  */

  app.use('/api/entries', router);
};
