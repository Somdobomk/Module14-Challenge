// express, path, sequelize, initialized app
const express = require('express');
const routes = require('./controllers')
const sequelize = require('./config/connection');
const path = require('path');
const PORT = process.env.PORT || 3001;

//handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

//session
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = {
  secret: 'super secret',
  resave: false,
  saveUninitialized: true,
  cookie: {},
  store: new SequelizeStore({
    db: sequelize
  })
};

//initiate app and setup app
const app = express();
app.use(routes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(session(sessionStore));

//start a connection through sequelize
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
);