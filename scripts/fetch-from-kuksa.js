import app from '../src/server/server';
import { getEventApi } from 'kuksa-event-api-client';
import { Promise } from 'bluebird';
import { _ } from 'lodash';

const SubCamp = app.models.SubCamp;
const destroyAllSubCamps = Promise.promisify(SubCamp.destroyAll, { context: SubCamp });
const createSubCamps = Promise.promisify(SubCamp.create, { context: SubCamp });
const findSubCamps = Promise.promisify(SubCamp.find, { context: SubCamp });

const Village = app.models.Village;
const destroyAllVillages = Promise.promisify(Village.destroyAll, { context: Village });
const createVillages = Promise.promisify(Village.create, { context: Village });
const findVillages = Promise.promisify(Village.find, { context: Village });

const CampGroup = app.models.CampGroup;
const destroyAllCampGroups = Promise.promisify(CampGroup.destroyAll, { context: CampGroup });
const createCampGroups = Promise.promisify(CampGroup.create, { context: CampGroup });
const findCampGroups = Promise.promisify(CampGroup.find, { context: CampGroup });

const LocalGroup = app.models.LocalGroup;
const destroyAllLocalGroups = Promise.promisify(LocalGroup.destroyAll, { context: LocalGroup });
const createLocalGroups = Promise.promisify(LocalGroup.create, { context: LocalGroup });
const findLocalGroups = Promise.promisify(LocalGroup.find, { context: LocalGroup });

const Participant = app.models.Participant;
const createParticipants = Promise.promisify(Participant.create, { context: Participant });
const findParticipants = Promise.promisify(Participant.find, { context: Participant });

if (require.main === module) {
  main().then(
    () => { console.log('Finished successfully.'); process.exit(0); },
    err => { console.error(`Error: ${err}. Exiting.`); process.exit(1); }
  );
}

function main() {
  return getOptionsFromEnvironment()
    .then(getEventApi)
    .then(passthrough(transferSubCamps))
    .then(passthrough(transferVillages))
    .then(passthrough(transferCampGroups))
    .then(passthrough(transferLocalGroups))
    .then(passthrough(transferKuksaParticipants))
    .then(() => console.log('Transfer compete'))
    .then(() => findSubCamps().then(res => console.log(res)))
    .then(() => findVillages().then(res => console.log(res)))
    .then(() => findCampGroups().then(res => console.log(res)))
    .then(() => findLocalGroups().then(res => console.log(res)))
    .then(() => findParticipants().then(res => console.log(res)));
}

function getOptionsFromEnvironment() {
  function extractEnvVar(environmentVariable, description) {
    const value = process.env[environmentVariable];
    if (!value) {
      throw new Error(`Specify ${description} in the environment variable ${environmentVariable}.`);
    }
    return value;
  }

  return Promise.try(() => ({
    endpoint: extractEnvVar('KUKSA_API_ENDPOINT', 'the endpoint url of the kuksa api'),
    username: extractEnvVar('KUKSA_API_USERNAME', 'the username for the kuksa api'),
    password: extractEnvVar('KUKSA_API_PASSWORD', 'the password for the kuksa api'),
    eventId: extractEnvVar('KUKSA_API_EVENTID', 'the event id for Roihu'),
  }));
}

function passthrough(func) {
  function execute(arg) {
    return func(arg).then(() => arg);
  }

  return execute;
}

function transferSubCamps(eventApi) {
  return eventApi.getSubCamps()
    .then(subCamps => destroyAllSubCamps().then(() => createSubCamps(subCamps)));
}

function transferVillages(eventApi) {
  return eventApi.getVillages()
    .then(villages => villages.map(village => ({
      id: village.id,
      subCampId: village.subCamp,
      name: village.name,
    })))
    .then(villages => destroyAllVillages().then(() => createVillages(villages)));
}

function transferCampGroups(eventApi) {
  return eventApi.getCampGroups()
    .then(campGroups => campGroups.map(campGroup => ({
      id: campGroup.id,
      subCampId: campGroup.subCamp,
      villageId: campGroup.village,
      name: campGroup.name,
    })))
    .then(campGroups => destroyAllCampGroups().then(() => createCampGroups(campGroups)));
}

function transferLocalGroups(eventApi) {
  return eventApi.getLocalGroups()
    .then(localGroups => localGroups.map(localGroup => ({
      id: localGroup.id,
      subCampId: localGroup.subCamp,
      villageId: localGroup.village,
      campGroupId: localGroup.campGroup,
      name: localGroup.name,
      scoutOrganization: localGroup.scoutOrganization,
      locality: localGroup.locality,
      country: localGroup.country,
      countryCode: localGroup.countryCode,
    })))
    .then(localGroups => destroyAllLocalGroups().then(() => createLocalGroups(localGroups)));
}

function transferKuksaParticipants(eventApi) {
  return eventApi.getParticipants()
    .then(participants => participants.map(participant => ({
      firstName: participant.firstName || 'x',
      lastName: participant.lastName || 'x',
      nonScout: false,
      memberNumber: 0,
      dateOfBirth: new Date(participant.birthDate),
      phoneNumber: participant.phoneNumber,
      email: participant.email,
      homeCity: participant.address.postCode,
      swimmingSkill: '200 m',
      localGroup: participant.group || 'Ei tiedossa',
      campGroup: participant.campGroup || 'Ei tiedossa',
      subCamp: participant.subCamp || 'Ei tiedossa',
      ageGroup: 'Aikuinen',
    })))
    .then(participants =>
      _.reduce(participants, (acc, participant) =>
        acc.then(() => createParticipants(participant)), Promise.resolve())
    );
}
