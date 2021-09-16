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
      user_id: req.body.user_id,
    },
  });

  if (checkIfAlreadyVoted) {
    res.status(400).send({
      message: 'You already voted on this comment.',
    });

    return;
  }

  const checkCommentAuthor = await EntryComment.findOne({
    where: {
      entry_comment_id: req.body.entry_comment_id,
      user_id: req.body.user_id,
    },
  });

  if (checkCommentAuthor) {
    res.status(400).send({
      message: 'Nie mozesz głosować na swój komentarz.',
    });

    return;
  }

  const checkCommentExistsOrBlock = await EntryComment.findOne({
    where: { entry_comment_id: req.body.entry_comment_id, is_blocked: false },
  });

  if (!checkCommentExistsOrBlock) {
    res.status(400).send({
      message: 'Comment with this ID not exists or is blocked.',
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
