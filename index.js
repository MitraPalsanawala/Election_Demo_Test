const express = require('express')
const dotenv = require('dotenv')

var path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

dotenv.config();

var indexRouter = require('./APIRoute/IndexRoute');
var APIRouter = require('./APIRoute/APIRoute');
app.use('/api', APIRouter);
app.use('/', indexRouter);

app.use(express.static(path.join(__dirname, "public")));

//app.use('/api/BoothMaster', require('./APIController/BoothMaster'));

app.listen(process.env.PORT, () => {
    console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
});