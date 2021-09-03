const db = require('../models');

const Entry = db.entry;
const EntryComment = db.entryComment;
const CommentVote = db.commentVote;

exports.createComment = async (req, res) => {
  if (!req.body.comment) {
    res.status(400).send({
      message: 'Missing comment content.',
    });

    return;
  }

  if (!req.body.nick_name) {
    res.status(400).send({
      message: 'Missing nick name.',
    });

    return;
  }

  if (req.body.parent_comment_id) {
    const checkIfParentCommentExists = await EntryComment.findOne({
      where: {
        entry_comment_id: req.body.parent_comment_id,
      },
    });

    if (!checkIfParentCommentExists) {
      res.status(400).send({
        message: 'Parent comment not exists.',
      });

      return;
    }
  }

  const checkEntryExists = await Entry.findOne({
    where: {
      entry_id: req.body.entry_id,
      is_blocked: false,
      disable_comments: false,
    },
  });

  if (!checkEntryExists) {
    res.status(400).send({
      message:
        'Entry with this ID not exists, is blocked or comments for this entry was disabled.',
    });

    return;
  } else {
    const comment = {
      comment: req.body.comment,
      entry_id: req.body.entry_id,
      parent_comment_id: req.body.parent_comment_id
        ? req.body.parent_comment_id
        : null,
      nick_name: req.body.nick_name,
      created_ip_address: req.clientIp,
      user_id: req.body.user_id,
    };

    EntryComment.create(comment)
      .then((data) => {
        res.send({
          message: 'Comment added.',
          newCommentId: data.entry_comment_id,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the comment.',
        });
      });
  }
};

exports.getComments = (req, res) => {
  const { order } = req.query;

  const conditions = {
    entry_id: req.params.id,
    is_blocked: false,
  };

  const orderBy = 'createdAt';

  EntryComment.findAll({
    where: conditions,
    order: [[orderBy, order ? order : 'DESC']],
    attributes: {
      include: [
        [
          db.Sequelize.literal(
            '(SELECT COUNT(*) FROM comment_votes WHERE comment_votes.entry_comment_id=entry_comments.entry_comment_id AND comment_votes.vote_up=1)'
          ),
          'votes_up_count',
        ],
        [
          db.Sequelize.literal(
            '(SELECT COUNT(*) FROM comment_votes WHERE comment_votes.entry_comment_id=entry_comments.entry_comment_id AND comment_votes.vote_up=0)'
          ),
          'votes_down_count',
        ],
        [
          db.Sequelize.fn(
            'COUNT',
            db.Sequelize.col('comment_vote.comment_vote_id')
          ),
          'votes_count',
        ],
      ],
    },
    include: [{ model: CommentVote, attributes: [] }],
    group: ['entry_comments.entry_comment_id'],
  })
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send({
          message: 'Comments not found.',
        });

        return;
      }

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving comments.',
      });
    });
};
