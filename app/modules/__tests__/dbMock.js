import Document from '../../Document';

const db = {
  items: {},
  nbGetItemCall: 0,
  nbSetItemCall: 0,
  config: () => this,
  setItem: (k, v) => {
    db.nbSetItemCall++;
    db.items[k] = v;

    return Promise.resolve();
  },
  getItem: (k) => {
    db.nbGetItemCall++;

    return Promise.resolve(db.items[k] || null);
  },
  addDocument: (id, encryptedContent) => {
    db.items[id] = new Document({
      uuid: id,
      content: encryptedContent,
    });
  },
  reset: () => {
    db.items = {};
    db.nbGetItemCall = 0;
    db.nbSetItemCall = 0;
  },
};

export default db;
