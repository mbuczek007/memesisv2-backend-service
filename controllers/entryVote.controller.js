const db = require('../models');

const Entry = db.entry;
const EntryVote = db.entryVote;

exports.addVote = async (req, res) => {
  if (!req.body.entry_id) {
    res.status(400).send({
      message: 'Missing entry ID.',
    });

    return;
  }

  const checkIfAlreadyVoted = await EntryVote.findOne({
    where: {
      entry_id: req.body.entry_id,
      created_ip_address: req.clientIp,
    },
  });

  if (checkIfAlreadyVoted) {
    res.status(400).send({
      message: 'You already voted on this entry.',
    });

    return;
  }

  const checkEntryExists = await Entry.findOne({
    where: {
      entry_id: req.body.entry_id,
      is_blocked: false,
      is_private: false,
    },
  });

  if (!checkEntryExists) {
    res.status(400).send({
      message: 'Entry with this ID not exists is blocked or is private.',
    });

    return;
  } else {
    const vote = {
      entry_id: req.body.entry_id,
      vote_up: true,
      created_ip_address: req.clientIp,
    };

    EntryVote.create(vote)
      .then((data) => {
        res.send({
          message: 'Vote added.',
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the entry vote.',
        });
      });
  }
};
