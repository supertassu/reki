import app from '../src/server/server';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { resetDatabase } from '../scripts/seed-database';
import mockKuksa from './kuksa-integration/mock/mock-kuksa';
import { exec } from 'child_process';
import Promise from 'bluebird';
import _ from 'lodash';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Kuksa integration', () => {
  const countParticipants = Promise.promisify(app.models.Participant.count, { context: app.models.Participant });

  before(function(done) {
    this.timeout(20000);
    return resetDatabase().then(() => {
      mockKuksa.serveFixtures('all');
      mockKuksa.start();

      const options = {
        cwd: process.CWD,
        env: _.merge(process.env, {
          KUKSA_API_ENDPOINT: mockKuksa.endpoint,
          KUKSA_API_USERNAME: mockKuksa.username,
          KUKSA_API_PASSWORD: mockKuksa.password,
          KUKSA_API_EVENTID: mockKuksa.eventid,
        }),
      };
      exec('npm run fetch-from-kuksa', options, () => { console.log('jee'); done(); });
    });
  });

  it('produces the expected amount of results in the database',
    () => expect(countParticipants()).to.eventually.equal(53)
  );

  after(() => {
    mockKuksa.stop();
  });
});