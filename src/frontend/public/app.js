import App from '../common/app';

function renderApp() {
  App(require('../../routes').publicRoutes);
}

renderApp();
if (module.hot) {
  module.hot.accept('../../routes', renderApp);
}
