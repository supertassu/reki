export function getParticipantStore(alt, ParticipantActions, RegistryUserActions) {
  class ParticipantStore  {
    constructor() {
      this.resetAllData();

      this.bindListeners({
        handleUpdateParticipantById: ParticipantActions.UPDATE_PARTICIPANT_BY_ID,
        handleParticipantListUpdated: ParticipantActions.PARTICIPANT_LIST_UPDATED,
        handleParticipantCountUpdated: ParticipantActions.PARTICIPANT_COUNT_UPDATED,
        handleLocalGroupsLoaded: ParticipantActions.LOCAL_GROUPS_LOADED,
        resetAllData: RegistryUserActions.RESET_ALL_DATA,
      });
    }

    handleUpdateParticipantById(participant) {
      this.participantDetails = participant;
    }

    handleParticipantListUpdated(participants) {
      this.participants = participants;
    }

    handleParticipantCountUpdated(newCount) {
      this.participantCount = newCount;
    }

    handleLocalGroupsLoaded(localGroups) {
      this.localGroups = localGroups;
    }

    resetAllData() {
      this.participants = [ ];
      this.participantDetails = {};
      this.participantCount = 0;

      this.localGroups = [''];
      this.campGroups = [''];
    }
  }

  return alt.createStore(ParticipantStore, 'ParticipantStore');
}
