import App from '../common/app';
import routes from './routes';

App(routes);

if (module.hot) {
  module.hot.accept('./routes', () => App(require('./routes').default));
}
