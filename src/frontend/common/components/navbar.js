import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// const Navbasdfr = () => (

//   <nav className="navbar navbar-fixed-top">
//       <div className="container">
//           <div className="navbar-header">
//               <button aria-expanded="false" className="navbar-toggle collapsed" data-target="#navbar-collapse" data-toggle="collapse" type="button">
//                   <span className="sr-only">Toggle navigation</span>
//                   <span className="icon-bar" />
//                   <span className="icon-bar" />
//                   <span className="icon-bar" />
//               </button>
//               <Link className="navbar-brand" to="/">
//                   <img src="/img/logo-horizontal.svg" />
//                   <h1 className="strong" style={{display: 'none'}}>Locust<span className="thin">Walk</span></h1>
//               </Link>
//           </div>
//           <div className="collapse navbar-collapse" id="navbar-collapse">
//               <ul className="nav navbar-nav clean">
//                   <li><Link to="/about">About</Link></li>
//                   <li><Link to="/staff">Staff</Link></li>
//                   <li><Link to="/submissions">Submissions</Link></li>
//                   <li><Link to="/subscribe">Subscribe</Link></li>
//               </ul>
//           </div>
//       </div>
//   </nav>
// );

// export default Navbar;

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      collapsing: false,
      in: false,
      height: 'auto',
    };
  }

  toggle() {
    if (this.state.collapsing) {
      return;
    }

    let collapsed = this.state.collapsed;
    this.setState({
      collapsed: !collapsed,
      collapsing: true,
      height: collapsed ? 0 : this.refs['navbar-nav'].clientHeight,
    }, () => {
      setTimeout(() => {
        this.setState({
          height: collapsed ? this.refs['navbar-nav'].clientHeight : 0,
        }, () => {
          setTimeout(() => {
            this.setState({
              collapsing: false,
              height: 'auto',
              in: collapsed ? true : undefined,
            })
          }, 300);
        });
      }, 10);
    });
  }

  open() {
    if (this.state.collapsed) {
      this.toggle();
    }
  }

  close() {
    if (!this.state.collapsed) {
      this.toggle();
    }
  }

  render() {
    return (
      <nav className={classnames('navbar fixed-top', this.props.className)}>
          <div className="container">
              {React.cloneElement(this.props.brand, {
                className: "navbar-brand",
                onClick: this.close.bind(this),
              })}
              <button className="navbar-toggler" type="button" onClick={this.toggle.bind(this)}>
                  <span className="navbar-toggler-icon"></span>
              </button>
              <div className={classnames('navbar-collapse', {
                show: this.state.in,
                collapsing: this.state.collapsing,
                collapse: !this.state.collapsing,
              })} style={{
                height: this.state.height,
              }}>
                  <ul className="navbar-nav mr-auto" ref="navbar-nav">
                      {React.Children.map(this.props.links, link => {
                        return (
                          <li className="nav-item">
                              {React.cloneElement(link, {
                                onClick: this.close.bind(this),
                                className: 'nav-link',
                              })}
                          </li>
                        );
                      })}
                  </ul>
              </div>
          </div>
      </nav>
    );
  }
};

Navbar.propTypes = {
  links: PropTypes.arrayOf(PropTypes.element).isRequired,
  brand: PropTypes.element.isRequired,
};
