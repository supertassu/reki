export function getRegistryUserStore(alt, RegistryUserActions) {
  class RegistryUserStore  {
    constructor() {
      this.resetAllData();

      this.bindListeners({
        handleRegistryUserListUpdated: RegistryUserActions.REGISTRY_USER_LIST_UPDATED,
        handleCurrentUserUpdated: RegistryUserActions.CURRENT_USER_UPDATED,
        handleLoginStatusUpdated: RegistryUserActions.UPDATE_LOGIN_STATUS,
        handleOfflineLoginNotEnabled: RegistryUserActions.OFFLINE_LOGIN_NOT_ENABLED,
        resetAllData: RegistryUserActions.RESET_ALL_DATA,
      });
    }

    handleRegistryUserListUpdated(registryUsers) {
      this.registryUsers = registryUsers;
    }

    handleCurrentUserUpdated(newCurrentUser) {
      this.currentUser = newCurrentUser;
    }

    handleLoginStatusUpdated(loggedIn) {
      this.loggedIn = loggedIn;
    }

    handleOfflineLoginNotEnabled(tried) {
      this.offlineLoginTriedWhileDisabled = tried;
    }

    resetAllData() {
      this.loggedIn = false;
      this.currentUser = null;
      this.registryUsers = [];
    }
  }

  return alt.createStore(RegistryUserStore, 'RegistryUserStore');
}
