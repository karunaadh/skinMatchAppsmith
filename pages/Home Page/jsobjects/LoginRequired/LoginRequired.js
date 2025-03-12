export default {
  checkUserLogin() {
    if (!appsmith.store.loggedUser) {
      showModal(LoginRequiredModal)// Show modal if not logged in
    }
  }
};