const db = require('../models');
const Op = db.Sequelize.Op;

const Entry = db.entry;

exports.create = async (req, res) => {
  if (!req.body.title) {
    res.status(400).send({
      message: 'Title can not be empty.',
    });

    return;
  }

  const nickExists = await Entry.findOne({
    where: { nick_name: req.body.nick_name },
  });

  if (nickExists) {
    res.status(400).send({
      message: 'This nick exists.',
    });

    return;
  }

  const entry = {
    title: req.body.title,
    description: req.body.description,
    source: req.body.source,
    source_info: req.body.source_info,
    source_type_id: req.body.source_type_id,
    nick_name: req.body.nick_name,
    disable_comments: req.body.disable_comments,
    created_ip_address: req.clientIp,
  };

  Entry.create(entry)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the entry.',
      });
    });
};

exports.findAll = (req, res) => {
  const status = req.query.status;
  const ststusCondition = {
    is_accepted: status === 'accepted' ? true : false,
  };

  Entry.findAll({ where: status ? ststusCondition : null })
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send({
          message: 'Entries not found.',
        });

        return;
      }

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving entries.',
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Entry.findByPk(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: 'Entry with id=' + id + ' not found',
        });

        return;
      }

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Entry with id=' + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Entry.destroy({
    where: { entry_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Entry was deleted successfully!',
        });
      } else {
        res.status(404).send({
          message: `Cannot delete Entry with id=${id}. Maybe Entry was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Entry with id=' + id,
      });
    });
};

exports.updateAcceptanceStatus = (req, res) => {
  const id = req.params.id;

  Entry.update(
    {
      is_accepted: req.body.is_accepted,
      updated_date: db.Sequelize.fn('now'),
      accepted_date: db.Sequelize.fn('now'),
      updated_ip_address: req.clientIp,
    },
    {
      where: {
        entry_id: id,
      },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Acceptance status for Entry was changed successfully.',
        });
      } else {
        res.status(404).send({
          message: `Entry with id=${id} was not found`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          'Error during change acceptacne status for Entry with id=' + id,
      });
    });
};
