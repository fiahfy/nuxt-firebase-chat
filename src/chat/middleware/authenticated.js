export default ({ redirect, store }) => {
  if (!store.getters['isSignedIn']) {
    return redirect('/login')
  }
}
