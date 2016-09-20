import request from 'supertest';
import path from 'path';
import server from '../../server';
import fs from 'fs';

// see: https://github.com/mochajs/mocha/issues/1847
const { before, after, describe, it } = global;

describe('Express app', () => {
  const DOCUMENTS_ENDPOINT = '/documents';
  const VALID_DOCUMENT_UUID = '9950e80b-f214-45d0-a98c-bffee2582c71';
  const NEW_DOCUMENT_UUID = '0000e80b-f214-45d0-a98c-bffee2581234';
  const EXISTING_DOCUMENT_UUID = '1111e81b-f214-45d1-a98c-bffee2581234';
  const READONLY_DOCUMENT_UUID = '1e17761d-035a-4eb7-8aa7-48f1bc6e8a48';

  const api = request.agent(server);

  it('calls /', (done) => {
    api
      .get('/')
      .expect('Content-type', /html/)
      .expect(200, done);
  });

  describe('- GET /documents/:uuid', () => {
    it('returns 400 if document id is not a valid UUID', (done) => {
      api
        .get(`${DOCUMENTS_ENDPOINT}/123`)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('returns an existing document in JSON', (done) => {
      api
        .get(`${DOCUMENTS_ENDPOINT}/${VALID_DOCUMENT_UUID}`)
        .expect('Content-Type', /json/)
        .expect(200, {
          content: { ba: 'bar' },
          last_modified: 1459441561629,
          uuid: '9950e80b-f214-45d0-a98c-bffee2582c71'
        }, done);
    });

    it('returns an existing document in JSON (readonly)', (done) => {
      api
        .get(`${DOCUMENTS_ENDPOINT}/${READONLY_DOCUMENT_UUID}`)
        .expect('Content-Type', /json/)
        .expect(200, {
          content: { ba: 'bar' },
          last_modified: 1459441561629,
          uuid: READONLY_DOCUMENT_UUID,
        }, done);
    });
  });

  describe('- PUT /documents/:uuid', () => {
    before((done) => {
      // remove file created when testing the creation of a new document
      fs.unlink(path.join(process.env.MONOD_DATA_DIR, NEW_DOCUMENT_UUID), () => {
        // create existing file that will be updated
        fs.writeFile(
          path.join(process.env.MONOD_DATA_DIR, EXISTING_DOCUMENT_UUID),
          '{}',
          done
        );
      });
    });

    after((done) => {
      // cleanup everything
      fs.unlink(path.join(process.env.MONOD_DATA_DIR, NEW_DOCUMENT_UUID), () => {
        fs.unlink(path.join(process.env.MONOD_DATA_DIR, EXISTING_DOCUMENT_UUID), done);
      });
    });

    it('returns 400 if document id is not a valid UUID', (done) => {
      api
        .put(`${DOCUMENTS_ENDPOINT}/123`)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('returns 400 if content is not supplied', (done) => {
      api
        .put(`${DOCUMENTS_ENDPOINT}/${NEW_DOCUMENT_UUID}`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('returns 201 when a new document is persisted', (done) => {
      const content = 'foo';

      api
        .put(`${DOCUMENTS_ENDPOINT}/${NEW_DOCUMENT_UUID}`)
        .send({ content: content })
        .expect('Content-Type', /json/)
        .expect((res) => {
          // fix date value, given by the server, but ensure it is part of the
          // response
          if (res.body.last_modified) {
            res.body.last_modified = 'date';
          }
        })
        .expect(201, {
          content: content,
          uuid: NEW_DOCUMENT_UUID,
          template: '',
          last_modified: 'date'
        }, done);
    });

    it('returns 200 when an existing document is updated', (done) => {
      const content = 'bar';

      api
        .put(`${DOCUMENTS_ENDPOINT}/${EXISTING_DOCUMENT_UUID}`)
        .send({ content: content })
        .expect('Content-Type', /json/)
        .expect((res) => {
          // fix date value, given by the server, but ensure it is part of the
          // response
          if (res.body.last_modified) {
            res.body.last_modified = 'date';
          }
        })
        .expect(200, {
          content: content,
          uuid: EXISTING_DOCUMENT_UUID,
          template: '',
          last_modified: 'date'
        }, done);
    });

    it('returns 403 when a document is in readonly mode', (done) => {
      api
        .put(`${DOCUMENTS_ENDPOINT}/${READONLY_DOCUMENT_UUID}`)
        .send({ content: 'something' })
        .expect('Content-Type', /json/)
        .expect(403, {
          content: {
            ba: "bar"
          },
          last_modified: 1459441561629,
          uuid: READONLY_DOCUMENT_UUID,
        }, done);
    });
  });
});
