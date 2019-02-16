import { expect } from 'chai';
import {
  getWithUser,
  expectStatus,
  createUserWithRoles as createUser,
  deleteUsers,
  withFixtures,
} from '../utils/test-utils';
import { resetDatabase } from '../../scripts/seed-database';

describe('Single participant API endpoint', () => {
  let user;

  before(resetDatabase);
  beforeEach(async () => user = await createUser(['registryUser']));
  withFixtures(getFixtures());
  afterEach(deleteUsers);

  //TODO split this into several test cases for clarity
  it('returns correct info', async () => {
    const res = await getWithUser('/api/participants/1', user);
    expectStatus(res.status, 200);

    expect(res.body).to.have.property('firstName','Teemu');
    expect(res.body).to.have.property('dates');
    expect(res.body.dates).to.be.an('array').with.length(3);
    expect(res.body).to.have.property('allergies');
    expect(res.body.allergies).to.be.an('array').with.length(1);
    expect(res.body).to.have.property('presenceHistory');
    expect(res.body.presenceHistory).to.be.an('array').with.length(1);
    expect(res.body.presenceHistory[0]).to.have.property('presence',1);
    expect(res.body).to.have.property('selections');
    expect(res.body.selections).to.be.an('array').with.length(1);
    expect(res.body.selections[0]).to.have.property('groupName', 'herneenpalvojat');
    expect(res.body.selections[0]).to.have.property('selectionName', 'ok');
  });

  it('returns 404 when incorrect id is given', async () => {
    const res = await getWithUser('/api/participants/404', user);
    expectStatus(res.status, 404);
  });

  it('returns 404 when a string id is given', async () => {
    const res = await getWithUser('/api/participants/hello', user);
    expectStatus(res.status, 404);
  });

  function getFixtures() {
    return {
      'Participant': [
        {
          'participantId': 1,
          'firstName': 'Teemu',
          'lastName': 'Testihenkilö',
          'nonScout': false,
          'internationalGuest': false,
          'localGroup': 'Testilippukunta',
          'campGroup': 'Leirilippukunta',
          'village': 'Kylä',
          'subCamp': 'Alaleiri',
          'ageGroup': 'sudenpentu',
          'memberNumber': 123,
          'dateOfBirth': new Date(2018,5,10),
        },
      ],
      'ParticipantDate': [
        { id: 1, participantId: 1, date: new Date(2016,6,20) },
        { id: 2, participantId: 1, date: new Date(2016,6,21) },
        { id: 3, participantId: 1, date: new Date(2016,6,23) },
      ],
      'PresenceHistory': [
        {
          'participantParticipantId':1,
          'presence': 1,
          'timestamp': new Date(2016,6,20),
          'authorId': 3,
        },
      ],
      'Allergy': [
        {
          'allergyId': 1,
          'name': 'hernekeitto',
        },
      ],
      'Selection': [
        {
          'selectionId': 0,
          'participantParticipantId': 1,
          'kuksaGroupId': 0,
          'kuksaSelectionId': 0,
          'groupName': 'herneenpalvojat',
          'selectionName': 'ok',
        },
      ],
      'ParticipantAllergy': [
        {
          'allergyAllergyId': 1,
          'participantParticipantId': 1,
        },
      ],
    };
  }

});
