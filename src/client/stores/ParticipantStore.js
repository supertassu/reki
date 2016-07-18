export function getParticipantStore(alt, ParticipantActions, RegistryUserActions) {
  class ParticipantStore  {
    constructor() {
      this.resetAllData();

      this.bindListeners({
        handleUpdateParticipantById: ParticipantActions.UPDATE_PARTICIPANT_BY_ID,
        handleLoadParticipantList: ParticipantActions.LOAD_PARTICIPANT_LIST,
        handleParticipantListUpdated: ParticipantActions.PARTICIPANT_LIST_UPDATED,
        handleParticipantPropertyUpdated: ParticipantActions.PARTICIPANT_PROPERTY_UPDATED,
        resetAllData: RegistryUserActions.RESET_ALL_DATA,
      });
    }

    handleUpdateParticipantById(participant) {
      this.participantDetails = participant;
    }

    handleLoadParticipantList(countParticipants) {
      this.participants = undefined;
      if (countParticipants) {
        this.participantCount = undefined;
      }
    }

    handleParticipantListUpdated({ participants, newCount }) {
      this.participants = participants;
      if (newCount !== undefined) {
        this.participantCount = newCount;
      }
    }

    handleParticipantCountUpdated(newCount) {
      this.participantCount = newCount;
    }

    handleParticipantPropertyUpdated({ property, newValue }) {
      this.participantDetails[property] = newValue;
    }

    resetAllData() {
      this.participants = undefined;
      this.participantDetails = {};
      this.participantCount = undefined;

      this.localGroups = [''];
      this.campGroups = [''];
    }
  }

  return alt.createStore(ParticipantStore, 'ParticipantStore');
}
