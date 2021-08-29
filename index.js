require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requestIp = require('request-ip');
const path = require('path');

const app = express();

var corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestIp.mw());

const directory = path.join(__dirname, '/uploads');
app.use('/uploads', express.static(directory));

const db = require('./models');

/*db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and re-sync db.');
});*/

db.sequelize.sync();

require('./routes/entry.routes')(app);
require('./routes/entryVote.routes')(app);
require('./routes/entryComment.routes')(app);
require('./routes/commentVote.routes')(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
