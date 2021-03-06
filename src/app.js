/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const noteService = require('./noteService');
const folderService = require('./folderService');
const logger = require('./logger');
const noteRouter = require('./noteRouter');
const folderRouter = require('./folderRouter');
const { NODE_ENV, API_TOKEN } = require('./config');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

// middleware

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(function requireAuth(req, res, next) {
	const authValue = req.get('Authorization') || ' ';

	//verify bearer
	if (!authValue.toLowerCase().startsWith('bearer')) {
		return res.status(400).json({ error: 'Missing bearer token' });
	}

	const token = authValue.split(' ')[1];

	if (token !== API_TOKEN) {
		return res.status(401).json({ error: 'Invalid token' });
	}

	next();
});

// Routes

app.use('/api/notes', noteRouter);
app.use('/api/folders', folderRouter);

// errorHandler middleware

app.use(function errorHandler(error, req, res, next) {
	let response;
	if (NODE_ENV === 'production') {
		response = { error: { message: 'server error' } };
	} else {
		console.error(error);
		response = { message: error.message, error };
	}
	res.status(500).json(response);
});

// exports

module.exports = app;
