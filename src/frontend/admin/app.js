import App from '../common/app';

function renderApp() {
  App(require('../../routes').adminRoutes);
}

renderApp();
if (module.hot) {
  module.hot.accept('../../routes', adminRoutes);
}
