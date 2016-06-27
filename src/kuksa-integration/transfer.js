import { Promise } from 'bluebird';
import { _ } from 'lodash';

function waterfall(funcs) {
  return _.reduce(funcs, (previous, func) => previous.then(func), Promise.resolve());
}

export default function transfer(models) {
  const transfers = _.map(models, model => () => transferModel(model));
  return waterfall(transfers);
}

function transferModel(model) {
  const opts = { context: model.targetModel };
  const create = Promise.promisify(model.targetModel.create, opts);
  const destroyExisting = Promise.promisify(model.targetModel.destroyAll, opts);
  const upsert = objects => upsertObjects(model.targetModel, objects);
  const recreateAll = objects => destroyExisting().then(() => create(objects));

  return model.getFromSource(model.dateRange)
    .then(transformWith(model.transform))
    //If date range is set we can't delete all items first or we would lose the items
    //outside the given date range. Thus we must upsert instead.
    .then(model.dateRange ? upsert : recreateAll);
}

function upsertObjects(model, objects) {
  const upsertObject = Promise.promisify(model.upsert, { context: model });
  const upserts = _.map(objects, obj => () => upsertObject(obj));
  return waterfall(upserts);
}

function transformWith(fn) {
  return objects => _.map(objects, fn);
}
