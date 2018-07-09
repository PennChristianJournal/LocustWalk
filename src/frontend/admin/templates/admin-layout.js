
import React, {Component, Fragment} from 'react';
import Link from 'react-router-dom/Link';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import Navbar from '../../common/components/navbar';
import NotificationContext from '../components/notification-context';

class AdminLayout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offsetTop: 122,
    };
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <link href="/img/favicon.ico" rel="icon" type="image/x-icon" />
          <link href="https://fonts.googleapis.com/css?family=Lato:900,400,400italic,700,300" rel="stylesheet" type="text/css" />
          <link href="https://fonts.googleapis.com/css?family=Roboto:400,400italic,700" rel="stylesheet" type="text/css" />
          <link href="/bower_components/normalize-css/normalize.css" rel="stylesheet" type="text/css" />
          <link href="/bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
          <link href="/bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
          <link href="/css/common.css" rel="stylesheet" type="text/css" />
          <link href="/css/admin.css" rel="stylesheet" type="text/css" />
          {/* <link href="/css/admin-sidebar.css" rel="stylesheet" type="text/css" /> */}
        </Helmet>

        <NotificationContext name="notifications" style={{
          position: 'fixed',
          top: '0px',
          width: '100%',
          zIndex: 2000,
          marginTop: '15px',
        }} />

        <Navbar id="navbar" className="navbar-expand-md navbar-light"
          brand={
            <Link to="/admin">
                <img src="/img/logo-horizontal.svg" />
                <h1 className="strong" style={{display: 'none'}}>Locust<span className="thin">Walk Admin</span></h1>
            </Link>
          }
          links={[
            <Link to="/admin/features">Features</Link>,
            <Link to="/admin/topics">Topics</Link>,
            <Link to="/admin/articles">Articles</Link>,
            <a className="ml-auto" href="/admin/logout">Log Out</a>
          ]}
        />

        <main style={{
          // position: 'absolute',
          // top: '20px',
          // bottom: '0px',
          // width: '100%',
          // paddingTop: `${this.state.offsetTop}px`,
          paddingTop: '30px',
        }}>
            {/* <div style={{height: '100%'}}> */}
              { renderRoutes(this.props.route.routes) }
            {/* </div> */}
        </main>
        <div id="popup-root" />

        <footer>
          <script type="text/javascript" src="/js/manifest.js"></script>
          <script type="text/javascript" src="/js/react.js"></script>
          <script type="text/javascript" src="/js/adminApp.js"></script>
        </footer>
      </Fragment>
    );
  }
}

export default AdminLayout;
