const getVideoId = require('get-video-id');
const db = require('../models');
const Op = db.Sequelize.Op;

const Entry = db.entry;
const EntryComment = db.entryComment;
const EntryVote = db.entryVote;

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count, rows: entries } = data;

  const totalItems = count.length;

  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, entries, totalPages, currentPage };
};

exports.create = async (req, res) => {
  if (!req.body.title) {
    res.status(400).send({
      message: 'Title can not be empty.',
    });

    return;
  }

  if (!req.body.nick_name) {
    res.status(400).send({
      message: 'Nick can not be empty.',
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

  if (
    req.body.source_type !== 'file' &&
    req.body.source_type !== 'url' &&
    req.body.source_type !== 'yt-video'
  ) {
    res.status(400).send({
      message: 'Source type is not valid.',
    });

    return;
  }

  let source = req.body.source;

  if (req.body.source_type == 'yt-video') {
    const { id } = getVideoId(source);

    if (id) {
      source = id;
    } else {
      res.status(400).send({
        message: 'Video Link is not valid.',
      });

      return;
    }
  }

  const entry = {
    title: req.body.title,
    description: req.body.description,
    source,
    source_info: req.body.source_info,
    source_type: req.body.source_type,
    nick_name: req.body.nick_name,
    disable_comments: req.body.disable_comments,
    created_ip_address: req.clientIp,
  };

  Entry.create(entry)
    .then((data) => {
      res.send({
        message: 'Entry was added.',
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the entry.',
      });
    });
};

exports.findAll = (req, res) => {
  const { page, size, status, order } = req.query;

  let conditions = {
    is_accepted: status === 'accepted' ? true : false,
    is_blocked: false,
  };

  let orderBy = status === 'accepted' ? 'accepted_date' : 'created_date';

  if (status === 'blocked') {
    conditions = {
      is_blocked: true,
    };

    orderBy = 'updated_date';
  }

  const { limit, offset } = getPagination(page, size);

  Entry.findAndCountAll({
    where: conditions,
    limit,
    offset,
    order: [[orderBy, order ? order : 'DESC']],
    attributes: {
      include: [
        [
          db.Sequelize.literal(
            '(SELECT COUNT(*) FROM entry_comments WHERE entry_comments.entry_id=entries.entry_id)'
          ),
          'comments_count',
        ],
        [
          db.Sequelize.fn(
            'COUNT',
            db.Sequelize.col('entry_vote.entry_vote_id')
          ),
          'votes_count',
        ],
      ],
    },
    include: [{ model: EntryVote, attributes: [] }],
    group: ['entries.entry_id'],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);

      if (response.entries.length === 0) {
        res.status(404).send({
          message: 'Entries not found.',
        });

        return;
      }

      res.send(response);
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

exports.accept = (req, res) => {
  const id = req.params.id;

  Entry.update(
    {
      is_accepted: true,
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
          message: 'Entry was accepted.',
        });
      } else {
        res.status(404).send({
          message: `Entry with id=${id} was not found`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error during accept Entry with id=' + id,
      });
    });
};
