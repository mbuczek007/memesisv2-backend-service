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
  Entry.findAll()
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

exports.findAllAcceptedEntries = (req, res) => {
  Entry.findAll({ where: { is_accepted: true } })
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send({
          message: 'Accepted entries not found.',
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

exports.update = (req, res) => {
  const id = req.params.id;

  Entry.update(req.body, {
    where: { entry_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Entry was updated successfully.',
        });
      } else {
        res.status(404).send({
          message: `Cannot update Entry with id=${id}. Maybe Entry was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Entry with id=' + id,
      });
    });
};
