import config from '../conf';

export default function(app) {
  app.get('/api/config', app.wrap( async (req, res) => {
    res.json({
      fields: config.getParticipantFields(),
      tableFields: config.getParticipantTableFields(),
      detailsPageFields: config.getDetailsPageFields(),
      filters: config.getFilters(),
    });
  }));
}
