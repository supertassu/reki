import { _ } from 'lodash';

/*
 * This is the config file used for tests - don't change it unless you plan to change the tests too!
 *
 * Use production.config.js for setting your production config and default.config.js for your dev
 * environment. If you just want to get the app running and do some development, the default config
 * files should work just fine.
 */

/*
  Extra fields to sync from Kuksa in addition to the default ones.

  Field name (name): this is the internal name of the field used by REKI. Use only lowercase letters,
  uppercase letters and numbers and camelCase. E.g. "firstName".

  Data types (dataType):
  - string: string with maximum length of 255 characters.
  - date: date, without time part
  - boolean: a true/false value
  - integer: integer value

  Field types (type):
  - participant_field: fields that exist on the participant object directly, such as
    name or member number. These are the same for all events.
    For available fields, see: https://github.com/partio-scout/kuksa-event-api-client
  - extra_info_field: configurable text field in Kuksa, e.g. "Huoltajan nimi". These
    depend on the event.
  - single_select_field: configurable single-select field in Kuksa, e.g. "Ikäkausi". These
    depend on the event.
*/
const participantCustomFields = [
  'nickname',
  'dateOfBirth',
  'phoneNumber',
  'email',
  'diet',
  'ageGroup',
  'staffPosition',
  'staffPositionInGenerator',
  'willOfTheWisp',
  'willOfTheWispWave',
  'guardianOne',
  'guardianTwo',
  'familyCampProgramInfo',
  'childNaps',
  'homeCity',
  'swimmingSkill',
  'gender',
];

const participantTableFields = [
  'firstName',
  'lastName',
];

const filters = [
  {
    field: 'ageGroup',
    primary: true,
  },
  {
    field: 'staffPositionInGenerator',
    title: 'Pesti (kehitin)',
  },
];

const detailsPageFields = [
  {
    groupTitle: 'Yhteystiedot',
    fields: [
      'phone',
      'email',
    ],
  },
];

// Titles of the multi-select groups that should be synced from Kuksa.
// Each item represents the name of the selection group.
const customMultipleSelectionFields = [
  '0-11-vuotias lapsi osallistuu',
  'Lapsi osallistuu päiväkodin toimintaan seuraavina päivinä',
  '\tLapsi osallistuu kouluikäisten ohjelmaan seuraavina päivinä',
  'Lapsen uimataito',
  'Lapsi saa poistua itsenäisesti perheleirin kokoontumispaikalta ohjelman päätyttyä',
  '\tLapsi tarvitsee päiväunien aikaan vaippaa',
];

const participantDatesMapper = async wrappedParticipant => {
  // Map payment names to arrays of dates when the participant is present
  const paymentToDatesMappings = {
    'pe 15.7.': ['2016-07-15'],
    'la 16.7.': ['2016-07-16'],
    'su 17.7.': ['2016-07-17'],
    'ma 18.7.': ['2016-07-18'],
    'ti 19.7.': ['2016-07-19'],

    'ke 20.7.': ['2016-07-20'],
    'ke 20.7. 100% alennus': ['2016-07-20'],
    'ke 20.7. 50% alennus': ['2016-07-20'],

    'to 21.7.': ['2016-07-21'],
    'to 21.7. 100% alennus': ['2016-07-21'],
    'to 21.7. 50% alennus': ['2016-07-21'],

    'pe 22.7.': ['2016-07-22'],
    'pe 22.7. 100% alennus': ['2016-07-22'],
    'pe 22.7. 50% alennus': ['2016-07-22'],

    'la 23.7.': ['2016-07-23'],
    'la 23.7. 100% alennus': ['2016-07-23'],
    'la 23.7. 50% alennus': ['2016-07-23'],

    'su 24.7.': ['2016-07-24'],
    'su 24.7. 100% alennus': ['2016-07-24'],
    'su 24.7. 50% alennus': ['2016-07-24'],

    'ma 25.7.': ['2016-07-25'],
    'ma 25.7. 100% alennus': ['2016-07-25'],
    'ma 25.7. 50% alennus': ['2016-07-25'],

    'ti 26.7.': ['2016-07-26'],
    'ti 26.7. 100% alennus': ['2016-07-26'],
    'ti 26.7. 50% alennus': ['2016-07-26'],

    'ke 27.7.': ['2016-07-27'],
    'ke 27.7. 100% alennus': ['2016-07-27'],
    'ke 27.7. 50% alennus': ['2016-07-27'],

    'to 28.7.': ['2016-07-28'],
    'pe 29.7.': ['2016-07-29'],
    'la 30.7.': ['2016-07-30'],
    'su 31.7.': ['2016-07-31'],

    'Osallistun koko leirin ajaksi': ['2016-07-20','2016-07-21','2016-07-22','2016-07-23','2016-07-24','2016-07-25','2016-07-26','2016-07-27'],
    'Osallistun koko purkuleirille (4 päivää) ja saan alennusta leirimaksusta 20 euroa. Summa hyvitetään purkuleirin jälkeen..': ['2016-07-28','2016-07-29','2016-07-30','2016-07-31'],
    'Osallistun vain rakennus-/purkuleirille tai Home Hospitalityn isäntäperheenä.': [],
  };

  return _(await wrappedParticipant.getPayments())
    .flatMap(payment => {
      const dateMappings = paymentToDatesMappings[payment];

      if (dateMappings === undefined) {
        console.log(`Warning! A mapping from payment type '${payment}' to participation dates is missing!`);
      }

      return dateMappings || [];
    });
};

// Titles of multi-select fields containing the allergy information
const allergyFields = [
  'Ruoka-aineallergiat. Roihulla ruoka ei sisällä selleriä, kalaa tai pähkinää. Jos et löydä ruoka-aineallergiaasi tai sinulla on muita huomioita, ota yhteys Roihun muonitukseen: erityisruokavaliot@roihu2016.fi.',
  'Erityisruokavalio. Roihulla ruoka on täysin laktoositonta. Jos et löydä erityisruokavaliotasi tai sinulla on muita huomioita, ota yhteys Roihun muonitukseen: erityisruokavaliot@roihu2016.fi.',
];

// Field by which the view can be filtered (participantFields only)
const filterableByFields = [
  'subCamp',
  'village',
  'campGroup',
  'localGroup',
  'ageGroup',
  'childNaps',
  'accommodation',
  'country',
  'willOfTheWisp',
  'willOfTheWispWave',
  'internationalGuest',
];

// Roles and their permissions
const permissions = {
  registryUser: [
    'perform allowed test action',
    'view searchfilters',
    'view own user information',
    'modify searchfilters',
    'view participants',
    'edit participants',
    'view app configuration',
  ],
  registryAdmin: [
    'perform disallowed test action',
    'view registry users',
    'view own user information',
    'block and unblock users',
    'view app configuration',
  ],
};

// Split fetching participants to date ranges in order to avoid overloading Kuksa
const fetchDateRanges = [
  {
    'startDate': '2015-01-01T00:00:00',
    'endDate': '', // Defaults to right now
  },
];

// Takes the participant as fetched from Kuksa and maps it to the participant to
// save in the database
const participantBuilderFunction = async participant => {
  const p = participant;

  // Shorten family camp age group a bit
  let ageGroup = await p.getExtraSelection('Osallistun seuraavan ikäkauden ohjelmaan:') || 'Muu';
  if (ageGroup === 'perheleirin ohjelmaan (0-11v.), muistathan merkitä lisätiedot osallistumisesta "vain perheleirin osallistujille" -osuuteen.') {
    ageGroup = 'perheleiri (0-11v.)';
  }

  // Family camp residence needs to be deduced differently
  let subCamp = p.subCamp ? p.subCamp.name : 'Muu';
  if (p.accommodation === 'Perheleirissä') {
    subCamp = 'Riehu';
  }

  return {
    subCamp,
    village: p.village ? p.village.name : 'Muu',
    campGroup: p.campGroup ? p.campGroup.name : 'Muu',
    localGroup: p.representedParty || (p.localGroup ? p.localGroup.name : 'Muu'),

    dateOfBirth: p.dateOfBirth,
    billedDate: await p.getPaymentStatus('billed'),
    paidDate: await p.getPaymentStatus('paid'),
    phoneNumber: p.phoneNumber,
    email: p.email,
    internationalGuest: !!p.localGroup, // has local group == is international guest
    diet: p.diet,
    accommodation: p.accommodation || 'Muu',
    country: p.localGroup ? p.localGroup.country : 'Suomi',
    ageGroup: ageGroup,
    // Not a scout if 1) no finnish member number and 2) not part of international group ("local group")
    nonScout: !(p.memberNumber) && !(p.localGroup),
    staffPosition: await p.getExtraInfo('Pesti'),
    staffPositionInGenerator: await p.getExtraInfo('Pesti kehittimessä'),
    willOfTheWisp: await p.getExtraSelection('Virvatuli'),
    willOfTheWispWave: await p.getExtraSelection('Virvatulen aalto'),
    guardianOne: await p.getExtraInfo('Leirillä olevan lapsen huoltaja (nro 1)'),
    guardianTwo: await p.getExtraInfo('Leirillä olevan lapsen huoltaja (nro 2)'),
    familyCampProgramInfo: await p.getExtraInfo('Mikäli vastasit edelliseen kyllä, kerro tässä tarkemmin millaisesta ohjelmasta on kyse'),
    childNaps: await p.getExtraSelection('Lapsi nukkuu päiväunet'),
  };
};

export default {
  participantCustomFields: participantCustomFields,
  participantBuilderFunction: participantBuilderFunction,
  participantDatesMapper: participantDatesMapper,
  fetchDateRanges: fetchDateRanges,
  customMultipleSelectionFields: customMultipleSelectionFields,
  filterableByFields: filterableByFields,
  allergyFields: allergyFields,
  permissions: permissions,
  participantTableFields: participantTableFields,
  filters: filters,
  detailsPageFields: detailsPageFields,
};
