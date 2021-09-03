module.exports = (app) => {
  const { verifySignUp } = require('../middleware');
  const auth = require('../controllers/auth.controller');

  var router = require('express').Router();

  router.post(
    '/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    auth.signup
  );

  router.post('/signin', auth.signin);

  router.delete('/delete/:id', auth.delete);

  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );

    next();
  });

  app.use('/api/auth', router);
};
