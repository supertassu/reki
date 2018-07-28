import { _ } from 'lodash';
import Sequelize from 'sequelize';
import { sequelize } from '../models';

export default function(app) {
  app.get('/api/presence-history', async (req, res, next) => {
    try {
      const result = await sequelize.query(`SELECT participants."memberNumber", presence_histories.timestamp, presence_histories.presence FROM participants LEFT JOIN "presence_histories" ON participants."participantId" = presence_histories."participantParticipantId"`, { type: Sequelize.QueryTypes.SELECT });
      const grouped = _.groupBy(result, row => row.memberNumber);

      res.type('text/csv');
      res.writeHead(200);
      for (const memberNumber of Object.keys(grouped)) {
        const rows = grouped[memberNumber];
        const presences = rows.map(row => row.timestamp ? `${row.timestamp.toISOString()} -> ${row.presence}` : '').join(' | ');
        res.write(`${memberNumber},${presences}\n`);
      }
      res.end();
    } catch (e) {
      console.log(e);
      next(e);
    }
  });
}
