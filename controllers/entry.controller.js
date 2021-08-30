const getVideoId = require('get-video-id');
const nodeHtmlToImage = require('node-html-to-image');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const db = require('../models');

const Entry = db.entry;
const EntryVote = db.entryVote;

const generateFileName = () => {
  return uuidv4() + '-' + Date.now();
};

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
    req.body.source_type !== 'yt-video' &&
    req.body.source_type !== 'text'
  ) {
    res.status(400).send({
      message: 'Source type is not valid.',
    });

    return;
  }

  let source = req.body.source ? req.body.source : null;
  let imageName = `entry-image-${generateFileName()}.jpg`;

  if (req.body.source_type === 'yt-video') {
    const { id } = getVideoId(source);

    if (id) {
      source = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      imageName = `entry-image-${id}-${generateFileName()}.jpg`;
    } else {
      res.status(400).send({
        message: 'Video Link is not valid.',
      });

      return;
    }
  } else if (req.body.source_type === 'file' && req.files) {
    const file = req.files.source;
    const extensionName = path.extname(file.name);
    const allowedExtension = ['.png', '.jpg', '.jpeg'];

    if (!allowedExtension.includes(extensionName)) {
      res.status(400).send({
        message: 'Invalid Image extension',
      });

      return;
    }

    const buffer = req.files.source.data;
    const b64 = Buffer.from(buffer).toString('base64');
    const mimeType = req.files.source.mimetype;

    source = `data:${mimeType};base64,${b64}`;
  }

  const sourceElem = source ? `<img src="${source}" alt/>` : '';
  const description = req.body.description
    ? `<div class="desc">${req.body.description}</div>`
    : '';

  const image = await nodeHtmlToImage({
    type: 'jpeg',
    quality: 80,
    output: `./uploads/${imageName}`,
    html: `<html>
    <head>
      <style>
        html {
          -webkit-font-smoothing: antialiased;
          margin: 0;
          padding: 0;
        }

        body {
          width: 662px;
          height: auto;
          font-family: "Roboto", "Helvetica", "Arial", sans-serif;
          line-hright: 1.2;
          border: 1px solid rgba(145, 158, 171, 0.24);
          padding: 30px;
          margin: 0;
          box-sizing: border-box;
        }

        img {
          width: 100%;
          height: auto;
        }

        .ql-align-center {
          text-align: center;
        }

        .ql-align-right {
          text-align: right
        }

        .ql-align-justify {
          text-align: justify;
        }

        h2 {
          margin: 0;
          text-align: center;
          font-weight: 700;
          padding: 15px 0 5px;
          display: block;
          line-height: 1.334;
          font-size: 28px;
          color: #fda92d;
        }

        .desc,
        p  {
          font-size: 18px;
          color: #212b36;
        }

      </style>
    </head>
    <body>
        ${sourceElem}
        <h2>
          ${req.body.title}
       </h2>
      ${description}
    </body>
  </html>
  `,
  });

  if (!image) {
    res.status(400).send({
      message: 'Problem to generate image.',
    });

    return;
  }

  const entry = {
    title: req.body.title,
    description: req.body.description,
    source: imageName,
    source_info: req.body.source_info,
    source_type: req.body.source_type,
    nick_name: req.body.nick_name,
    disable_comments: req.body.disable_comments,
    is_private: req.body.is_private,
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
    is_private: false,
    is_archived: false,
  };

  let orderBy = status === 'accepted' ? 'accepted_date' : 'createdAt';

  if (!status) {
    conditions = null;
    orderBy = 'createdAt';
  }

  if (status === 'blocked') {
    conditions = {
      is_blocked: true,
    };

    orderBy = 'updatedAt';
  }

  if (status === 'private') {
    conditions = {
      is_private: true,
    };

    orderBy = 'updatedAt';
  }

  if (status === 'archived') {
    conditions = {
      is_archived: true,
    };

    orderBy = 'updatedAt';
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

  Entry.findOne({
    where: { entry_id: id, is_blocked: false, is_private: false },
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
      if (!data) {
        res.status(404).send({
          message: 'Entry with id=' + id + ' not found, is private or blocked',
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

exports.accept = async (req, res) => {
  const id = req.params.id;

  const notAcceptedBefore = await Entry.findOne({
    where: { entry_id: id },
  });

  Entry.update(
    {
      is_accepted: true,
      accepted_date: notAcceptedBefore.accepted_date
        ? notAcceptedBefore.accepted_date
        : db.Sequelize.fn('now'),
      updated_ip_address: req.clientIp,
    },
    {
      where: {
        entry_id: id,
        is_accepted: false,
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
          message: `Entry with id=${id} was not found or entry is already accepted`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error during accept Entry with id=' + id,
      });
    });
};

exports.reject = (req, res) => {
  const id = req.params.id;

  Entry.update(
    {
      is_accepted: false,
      updated_ip_address: req.clientIp,
    },
    {
      where: {
        entry_id: id,
        is_accepted: true,
      },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Entry was moved to pending.',
        });
      } else {
        res.status(404).send({
          message: `Entry with id=${id} was not found or entry is already in pending status.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error during reject Entry with id=' + id,
      });
    });
};
