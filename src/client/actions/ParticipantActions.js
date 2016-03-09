export function getParticipantActions(alt, participantResource, registryUserResource) {
  class ParticipantActions {
    fetchParticipantById(participantId) {
      return dispatch => {
        dispatch();
        participantResource.findById(participantId)
          .then(participant => this.updateParticipantById(participant))
          .catch(err => this.loadingParticipantByIdFailed(err));
      };
    }

    updateParticipantById(participant) {
      return participant;
    }

    loadingParticipantByIdFailed(err) {
      return err;
    }

    loadParticipantList(offset, limit) {
      const filters = {
        skip: offset,
        limit: limit,
      };

      return dispatch => {
        dispatch();
        participantResource.findAll(`filter=${JSON.stringify(filters)}`)
          .then(participantList => this.participantListUpdated(offset, participantList),
                err => this.participantListUpdateFailed(err));
      };
    }

    participantListUpdated(offset, participants) {
      return { offset, participants };
    }

    participantListUpdateFailed(error) {
      return error;
    }

    loadParticipantCount() {
      return dispatch => {
        dispatch();
        participantResource.raw('get', 'count')
          .then(response => this.participantCountUpdated(response.count),
                err => this.participantCountUpdateFailed(err));
      };
    }

    participantCountUpdated(newCount) {
      return newCount;
    }

    participantCountUpdateFailed(err) {
      return err;
    }

    loadRegistryUserList() {
      return dispatch => {
        dispatch();
        registryUserResource.findAll()
          .then(registryUserList => this.registryUserListUpdated(registryUserList),
                err => this.registryUserListUpdatedFailed(err));
      };
    }

    registryUserListUpdated(registryUsers) {
      return registryUsers;
    }

    registryUserListUpdatedFailed(error) {
      return error;
    }
  }

  return alt.createActions(ParticipantActions);
}
