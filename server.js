// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const hbs = require('express-handlebars');
const User = require('./models/User');
const Chat = require('./models/Chat');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');
const Room = require('./models/Rooms');
const roomIdGenerator = require('./util/roomIdGenerator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const JWT_SECRET="jsdjfsjfksdfjhsdjfhdsfkjsdhf87879837937987*&&%^$%$^&^&^&^ksjhfkdhfksdhkfjhdskfjhdsk"

var myAuthor;
var myChat;
// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
const registerHandler = require('./controllers/register.js');
const loginHandler = require('./controllers/login.js');
const passResetHandler = require('./controllers/passReset.js');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use ("/", express.static(path.join(__dirname,'static')))
app.use(bodyParser.json())

const db = config.get('mongoURI');



mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set up stylesheets route

// TODO: Add server side code

// Create controller handlers to handle requests at each endpoint

app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body
	console.log(plainTextPassword);
	console.log(token);
	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		console.log(password);
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
		console.log(req.body);
	}

})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)
		res.cookie("username", username);
		myAuthor = req.cookies.username;


		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})
app.post('/api/register', async (req, res) => {
	//console.log(req.body);

	const {username, password: plainTextPassword } = req.body

	if(!username || typeof username !== 'string'){
		return res.json({status:"error", error:"Invalid username"})
	}

	if(!plainTextPassword || typeof plainTextPassword !== "string") {
		return res.json({status:"error", error:"Invalid password"})
	}
	if (plainTextPassword.length < 4 ) {
		return res.json({status:"error", error:"Password is too short"})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)
	// create the user 
	try{
		await User.create({
			username,
			password
		})
	}catch(error) {
		console.log(error)
		return res.json({status:"error"})
	}
})

app.post("/create", function(req, res){
    const newRoom = new Room({
        name: req.body.roomName,
        id: roomIdGenerator.roomIdGenerator()
    })
    newRoom.save().then(console.log("room added"))
    .catch(e => console.log(e))
})

app.post("/myEdit", function(req, res){
	console.log('pweas')
	var myChat = req.body.chatID2
	var newChat = req.body.chatBox2
	var myquery = { ID: myChat };
	var newvalues = { $set: { text: newChat } };
	Chat.updateOne(myquery, newvalues, function(err, res) {
		console.log(err);
	})
	
})


app.post("/delete", function(req, res){
	var myChat = req.body.chatID;
	console.log("ID of chat getting removed: " + myChat)

	Chat.deleteOne(
		{
			ID: myChat
			
		},
		function(err) {
			console.log(err);
		}
		
	)
})

app.post("/createMsg", function(req, res){
    const newChat = new Chat({
        author: myAuthor,
        text: req.body.chatBox,
        roomName: req.body.roomName,
		ID: roomIdGenerator.roomIdGenerator()
    })


    newChat.save().then(console.log("chat added" + req.body.roomName))
    .catch(e => console.log(e))
})

app.get("/getChat", function(req, res){
    Chat.find().lean().then(items => {
        res.json(items)
    })
})

app.get("/getRoom", function(req, res){
    Room.find().lean().then(items => {
        res.json(items)
    })

})
app.get('/', homeHandler.getHome);
app.get('/register', registerHandler.getRegister);
app.get('/login', loginHandler.getLogin);
app.get('/passReset', passResetHandler.getpassReset);
app.get('/:roomName', roomHandler.getRoom);

// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));