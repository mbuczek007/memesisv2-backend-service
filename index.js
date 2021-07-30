require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requestIp = require('request-ip');

const app = express();

var corsOptions = {
  origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestIp.mw());

const db = require('./models');

/*db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and re-sync db.');
});*/

db.sequelize.sync();

require('./routes/entry.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
