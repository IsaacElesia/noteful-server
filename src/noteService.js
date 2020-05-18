const noteService = {
  getAllNotes(db) {
    return db('notes').select();
  },
  insertNote(db, newNote) {
    return db.insert(newNote).into('notes').returning('*').then(rows => rows[0]);
  },
  updateNote(db, id, newNote) {
    return db('notes').where({ id }).update(newNote).returning('*').then(rows => rows[0]);
  },
  deleteNote(db, id) {
    return db('notes').where({ id }).del();
  },
  getNoteById(db, id) {
    return db('notes').select('*').where({ id }).first();
  }
};

module.exports = noteService;