module.exports = (app) => {
  const entries = require('../controllers/entry.controller.js');

  var router = require('express').Router();

  // Create a new Entry
  router.post('/add', entries.create);

  // Retrieve all Entries
  router.get('/', entries.findAll);

  // Retrieve all accepted Entries
  router.get('/accepted', entries.findAllAcceptedEntries);

  // Retrieve a single Entry with id
  router.get('/:id', entries.findOne);

  // Delete a Entry with id
  router.delete('/delete/:id', entries.delete);

  // Update a Entry with id
  router.put('/update/:id', entries.update);

  app.use('/api/entries', router);
};
