import { models } from '../models';
import { Op } from 'sequelize';
import _ from 'lodash';
import config from '../conf';
import optionalBasicAuth from '../middleware/optional-basic-auth';

export default function(app){

  app.get('/api/participants/:id', optionalBasicAuth(), app.requirePermission('view participants'), app.wrap(async (req, res) => {
    const id = +req.params.id || 0;
    const participant = await models.Participant.findByPk(id , {
      include: [{ all: true, nested: true }],
    });

    if (participant) {
      await app.models.AuditEvent.createEvent.Participant(req.user.id, participant.participantId, 'find');
      res.json(participant);
    } else {
      res.status(404).send('Not found');
    }
  }));

  app.get('/api/participants', optionalBasicAuth(), app.requirePermission('view participants'), app.wrap(async (req, res) => {
    const filter = JSON.parse(req.query.filter || '{}');
    const limit = +filter.limit || undefined;
    const offset = +filter.skip || undefined;
    // TODO refactor so this comes in right format already
    const order = filter.order ? filter.order.split(' ') : ['participantId', 'ASC'];

    let where = filter.where || {};

    // TODO refactor this out: it's silly to have an and-array coming from frontend :)
    // More than one condition is represented as array for leagacy reasons -> move back to object
    if (where.and) {
      where = _.reduce(where.and, (cond, acc) => Object.assign(acc, cond), {});
    }

    // For free-text searching we need to add ILIKE filter for all searchable text fields
    if (where.textSearch) {
      const words = where.textSearch.split(/\s+/);
      // Why or statement inside an and statement? Because we want to every word in textSearch
      // to match at least once, but possibly match in different fields. For example "Firstname Lastname"
      // should match "Firstname" in first name and "Lastname" in last name.
      where[Op.and] = words.map(word => {
        const searches = config.getSearchableFieldNames().map(field => ({
          [field]: {
            [Op.iLike]: `%${word}%`,
          },
        }));
        return { [Op.or]: searches };
      });

      delete where.textSearch; // textSearch is not a real field -> remove, or Sequelize would throw error
    }

    // Date search
    let dateFilter;
    if (where.dates && where.dates.length && where.dates.length > 0) {
      dateFilter = {
        date: {
          [Op.in]: _.map(where.dates, dateStr => new Date(dateStr)),
        },
      };
    }
    delete where.dates;

    const result = await models.Participant.findAndCountAll( {
      where: where,
      include: [
        // Filter results using datesearch
        {
          model: models.ParticipantDate,
          as: 'datesearch',
          where: dateFilter,
        },
        // Get all dates of participant
        {
          model: models.ParticipantDate,
          as: 'dates',
        },
      ],
      offset: offset,
      limit: limit,
      order: [ order ],
      distinct: true, // without this count is calculated incorrectly
    });
    res.json( { result: result.rows, count: result.count });
  }));

  app.post('/api/participants/massAssign', optionalBasicAuth(), app.requirePermission('edit participants'), app.wrap(async (req, res) => {
    const updates = await models.Participant.massAssignField(
      req.body.ids,
      req.body.fieldName,
      req.body.newValue,
      req.user.id
    );
    res.json(updates);
  }));
}
