const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;
const { Op } = db.Sequelize;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
  if (
    req.body.name === '' ||
    req.body.email === '' ||
    req.body.password === ''
  ) {
    res.status(400).send({
      message: 'Fill all required fields.',
    });

    return;
  }

  if (
    req.body.name.length < 3 ||
    req.body.name.length > 20 ||
    !req.body.name.match(/^[A-Za-z0-9_.]+$/)
  ) {
    res.status(400).send({
      message:
        'Nazwa uzytkownika powinna zawierać od 3 do 20 znaków. Dopuszczalne znaki to A-Z a-z 0-9 . _',
    });

    return;
  }

  if (
    !req.body.email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) ||
    req.body.email > 100
  ) {
    res.status(400).send({
      message: 'Unvalid e-mail address.',
    });

    return;
  }

  if (
    !req.body.password.match(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
    )
  ) {
    res.status(400).send({
      message:
        'Hasło powinno zawierać minimum 8 znaków, jedną duzą literę, jedną małą literę, liczbę oraz znak specjalny',
    });

    return;
  }

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    sex: req.body.sex ? req.body.sex : 0,
    created_ip_address: req.clientIp,
  })
    .then((user) => {
      user.setRoles([1]).then(() => {
        const msg = {
          to: req.body.email,
          from: 'no-reply@ewangelizatory.pl',
          subject: 'Ewangelizatory.pl - Konto zostało utowrzone!',
          text: 'Konto zostało utworzone w serwisie ewangelizatory.pl',
          html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        sgMail
          .send(msg)
          .then((response) => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
          })
          .catch((error) => {
            console.error(error);
          });

        res.send({ message: 'User was registered successfully!' });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      [Op.or]: [{ name: req.body.name }, { email: req.body.name }],
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      if (user.is_blocked) {
        return res
          .status(404)
          .send({ message: 'This user account was blocked.' });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }

      const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; //60min
      const token = jwt.sign({ id: user.user_id }, config.secret, {
        expiresIn: expirationTime,
      });

      let authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.user_id,
          username: user.name,
          email: user.email,
          roles: authorities,
          accessToken: token,
          expirationTime,
        });
      });

      User.update(
        {
          last_login_date: db.Sequelize.fn('now'),
          last_login_ip_address: req.clientIp,
        },
        {
          where: {
            user_id: user.user_id,
          },
        }
      );
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { user_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'User was deleted successfully!',
        });
      } else {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete User with id=' + id,
      });
    });
};
