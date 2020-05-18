const folderService = {
  getAllFolders(db) {
    return db('folders').select();
  },
  insertFolder(db, newFolder) {
    return db.insert(newFolder).into('folders').returning('*').then(rows => rows[0]);
  },
  updateFolder(db, id, newFolder) {
    return db('folders').where({ id }).update(newFolder).returning('*').then(rows => rows[0]);
  },
  deleteFolder(db, id) {
    return db('folders').where({ id }).del();
  },
  getFolderById(db, id) {
    return db('folders').select('*').where({ id }).first();
  }
};

module.exports = folderService;