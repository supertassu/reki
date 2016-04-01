import React from 'react';
import { pureShouldComponentUpdate } from './utils';

export function getParticipantListUpdater(participantActions) {
  class ParticipantListUpdater extends React.Component {
    reloadList() {
      const {
        offset,
        limit,
        order,
      } = this.props;

      participantActions.loadParticipantList(offset, limit, order);
    }

    shouldComponentUpdate(nextProps, nextState) {
      return pureShouldComponentUpdate.call(this, nextProps, nextState);
    }

    render() {
      this.reloadList();
      return null;
    }
  }

  ParticipantListUpdater.propTypes = {
    offset: React.PropTypes.number.isRequired,
    limit: React.PropTypes.number.isRequired,
    order: React.PropTypes.object.isRequired,
  };

  return ParticipantListUpdater;
}
