const db = require('../models');

const EntryComment = db.entryComment;
const CommentVote = db.commentVote;

exports.addVote = async (req, res) => {
  if (!req.body.entry_comment_id) {
    res.status(400).send({
      message: 'Missing comment ID.',
    });

    return;
  }

  if (req.body.vote_mode === undefined) {
    res.status(400).send({
      message: 'Missing comment vote mode.',
    });

    return;
  }

  const checkIfAlreadyVoted = await CommentVote.findOne({
    where: {
      entry_comment_id: req.body.entry_comment_id,
      created_ip_address: req.clientIp,
    },
  });

  if (checkIfAlreadyVoted) {
    res.status(400).send({
      message: 'You already voted on this comment.',
    });

    return;
  }

  const checkCommentExists = await EntryComment.findOne({
    where: { entry_comment_id: req.body.entry_comment_id },
  });

  if (!checkCommentExists) {
    res.status(400).send({
      message: 'Comment with this ID not exists.',
    });

    return;
  } else {
    const vote = {
      entry_comment_id: req.body.entry_comment_id,
      vote_up: req.body.vote_mode,
      created_ip_address: req.clientIp,
      user_id: req.body.user_id,
    };

    CommentVote.create(vote)
      .then((data) => {
        res.send({
          message: 'Comment Vote added.',
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            'Some error occurred while creating the comment vote.',
        });
      });
  }
};
