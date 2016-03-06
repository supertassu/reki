import app from '../../server/server.js';
import Promise from 'bluebird';
import loopback from 'loopback';

export default function(Registryuser) {
  Registryuser.afterRemote('create', (ctx, registryuserInstance, next) => {
    const userId = ctx.req.accessToken ? ctx.req.accessToken.userId : 0;
    app.models.AuditEvent.createEvent.Registryuser(userId, registryuserInstance.id, 'add');
    next();
  });

  Registryuser.afterRemote('findById', (ctx, registryuserInstance, next) => {
    const userId = ctx.req.accessToken ? ctx.req.accessToken.userId : 0;
    app.models.AuditEvent.createEvent.Registryuser(userId, registryuserInstance.id, 'find');
    next();
  });

  Registryuser.afterRemote('prototype.updateAttributes', (ctx, registryuserInstance, next) => {
    const userId = ctx.req.accessToken ? ctx.req.accessToken.userId : 0;
    app.models.AuditEvent.createEvent.Registryuser(userId, registryuserInstance.id, 'update');
    next();
  });

  Registryuser.observe('before delete', (ctx, next) => {
    const findRegistryuser = Promise.promisify(app.models.Registryuser.find, { context: app.models.Registryuser });
    if (ctx.instance) {
      const userId = loopback.getCurrentContext().get('accessToken') ? loopback.getCurrentContext().get('accessToken').userId : 0;
      app.models.AuditEvent.createEvent.Registryuser(userId, ctx.instance.registryuserId, 'delete');
      next();
    } else {
      findRegistryuser({ where: ctx.where, fields: { id: true } })
        .each(registryuser => {
          const userId = loopback.getCurrentContext().get('accessToken') ? loopback.getCurrentContext().get('accessToken').userId : 0;
          app.models.AuditEvent.createEvent.Registryuser(userId, registryuser.id, 'delete');
        }).nodeify(next);
    }
  });
}
