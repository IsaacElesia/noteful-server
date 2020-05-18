const express = require('express');
const logger = require('./logger');
const xss = require('xss');
const folderRouter = express.Router();
const dataParser = express.json();
const folderService = require('./folderService');

const sanitize = (item) => ({
	id: item.id,
	folder_name: xss(item.folder_name),
});

folderRouter
	.route('/')
	.get((req, res, next) => {
		folderService
			.getAllFolders(req.app.get('db'))
			.then((folders) => res.json(folders.map((folder) => sanitize(folder))));
	})
	.post(dataParser, (req, res, next) => {
		const { name } = req.body;
		const folder_name = name;
		if (!folder_name) {
			logger.error("Failed post : User didn't supply folder name");
			res.status(400).json({ error: 'Folder Name is required' });
		}

		const newFolder = {
			folder_name,
		};

		folderService
			.insertFolder(req.app.get('db'), newFolder)
			.then((folder) => {
				logger.info(`Successful post : Folder ${folder_name} was added`);
				res.status(201).json(sanitize(folder));
			})
			.catch(next);
	});

folderRouter
	.route('/:id')
	.all((req, res, next) => {
		const { id } = req.params;

		folderService
			.getFolderById(req.app.get('db'), id)
			.then((folder) => {
				if (!folder) {
					logger.error(`Failed get folder with id: ${id}`);
					return res.status(404).json({
						error: { message: "Folder doesn't exist" },
					});
				}
				logger.info(
					`Successful get : folder ${folder.folder_name} was retrieved with id: ${folder.id}`
				);
				res.folder = folder;
				next();
			})
			.catch(next);
	})
	.get((req, res, next) => {
		res.json(sanitize(res.folder));
	})
	.delete((req, res, next) => {
		folderService.deleteFolder(req.app.get('db'), req.params.id).then(() => {
			logger.info('Successful delete: Folder was deleted');
			res.status(204).end();
		});
	})
	.patch(dataParser, (req, res, next) => {
		const { folder_name } = req.body;
		const folderToUpdate = { folder_name };
		const id = req.params.id;

		const valNum = Object.values(folderToUpdate).filter(Boolean).length;

		if (valNum === 0) {
			return res.status(400).json({
				error: { message: "Request body must contain 'folder_name'" },
			});
		}

		folderService
			.updateFolder(req.app.get('db', id, folderToUpdate))
			.then(() => {
				res.status(204).end();
			})
			.catch(next);
	});

module.exports = folderRouter;
