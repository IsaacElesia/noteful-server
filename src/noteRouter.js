const express = require('express');
const logger = require('./logger');
const xss = require('xss');
const noteRouter = express.Router();
const dataParser = express.json();
const noteService = require('./noteService');

const sanitize = item => ({
  id: item.id,
  modified: item.modified,
  folderid: item.folderid,
  note_name: xss(item.note_name),
  content: xss(item.content)
});

noteRouter
  .route('/')
  .get((req, res, next) => {
    noteService.getAllNotes(req.app.get('db'))
      .then(notes => res.json(notes.map(note => sanitize(note))));
  })
  .post(dataParser, (req, res, next) =>{
    const { note_name, content, folderid, modified} = req.body;

    if (!note_name || !content || !folderid || !modified) {
      logger.error('Failed post : User didn\'t supply note name or content');
      res.status(400).json({ error: 'Note Name and content is required' });
    }

    const newNote = {
      modified,
      folderid,
      note_name,
      content
    };

    noteService.insertNote(req.app.get('db') , newNote)
      .then(note => {
        logger.info(`Successful post : Note ${note_name} was added`);
        res.status(201).json(sanitize(note));
      })
      .catch(next);
  });

noteRouter
  .route('/:id')
  .all((req, res, next) => {
    const { id } = req.params;

    noteService.getNoteById(req.app.get('db'), id)
      .then(note => {
        if (!note) {
          logger.error(`Failed get note with id: ${id}`);
          return res.status(404).json({
            error: { message: 'note doesn\'t exist' }
          });
        }
        logger.info(
          `Successful get : folder ${note.note_name} was retrieved with id: ${note.id}`
        );
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(sanitize(res.note));
  })
  .delete((req, res, next) => {
    noteService.deleteNote(req.app.get('db'), req.params.id)
      .then(() => {
        logger.info(
          'Successful delete: Note was deleted'
        );
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(dataParser, (req, res, next) => {
    const { note_name, content, folderid } = req.body;
    const noteToUpdate = { note_name, content, folderid};
    const id = req.params.id;

    const valNum = Object.values(noteToUpdate).filter(Boolean).length;

    if (valNum === 0) {
      return res.status(400).json({
        error: {message: 'Request body must contain \'note_name\', \'content\', and \'folderId\''}
      });
    }

    noteService.updateNote(req.app.get('db', id, noteToUpdate))
      .then(() => {
        res.status(204);
      })
      .catch(next);
  });
    
module.exports = noteRouter;