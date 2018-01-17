
import React, {Component} from 'react';
import Navbar from '~/admin/frontend/components/navbar';
import NotificationContext from '~/admin/frontend/components/notification-context';
import {headData} from '~/common/frontend/head';

class AdminLayout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offsetTop: 122,
    };
  }

  render() {
    return (
      <div className="admin-layout" id={this.props.id}>
          <NotificationContext name="notifications" style={{
            position: 'fixed',
            top: '0px',
            width: '100%',
            zIndex: 2000,
            marginTop: '15px',
          }} />
          <Navbar id="navbar" />
          <div style={{
            position: 'absolute',
            top: '20px',
            bottom: '0px',
            width: '100%',
            paddingTop: `${this.state.offsetTop}px`,
          }}>
              <div style={{height: '100%'}}>
                  {this.props.children}
              </div>
          </div>

          <footer>
              <script src="/bower_components/jquery/dist/jquery.min.js"></script>
              <script src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
          </footer>
      </div>
    );
  }
}

export default headData(head => {
  head.addLink([
    {
      href: '/css/admin.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/admin-sidebar.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ]);
})(AdminLayout);
