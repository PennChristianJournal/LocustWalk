
import React, {Component} from 'react';
import Navbar from '~/admin/frontend/components/navbar';

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
          <Navbar id="navbar" />
          
          {this.props.modal}
          
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

export default AdminLayout;

AdminLayout.metadata = {
  link: [
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
  ],
};