/*global browser*/
import * as testUtils from '../utils/test-utils';
import { resetDatabase } from '../../scripts/seed-database';
import mockKuksa from '../utils/kuksa-integration/mock/mock-kuksa';
import { exec } from 'child_process';

describe.skip('Search', () => {
  let accessToken;

  // Only run this once because it's so heavy and these tests don't change state
  before(function(done) {
    this.timeout(80000);
    return resetDatabase().then(() => {
      mockKuksa.serveFixtures('all');
      mockKuksa.start();
      exec('npm run fetch-from-kuksa', mockKuksa.getOptionsForExec(), () => done());
    });
  });

  beforeEach(() =>
    testUtils.createUserWithRoles(['registryUser'])
  );

  it('should initally display all results', () =>
    browser
      .url(`/dev-login/${accessToken.id}`)
      .waitForVisible('a=Kirjaudu ulos') // logged in
      .click('a=Leiriläiset')
      .waitForVisible('53')
      .getText('.participant-count .h2').should.eventually.equal('53')
      //TODO also test how many rows are in the table
  );

  afterEach(() => testUtils.deleteFixturesIfExist('User'));

  after(() => {
    mockKuksa.stop();
  });

  after(() => resetDatabase());
});
