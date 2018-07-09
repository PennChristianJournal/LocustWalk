import React from 'react';
import Link from 'react-router-dom/Link';

const Navbar = () => (
  <nav className="navbar navbar-fixed-top">
      <div className="container">
          <div className="navbar-header">
              <button aria-expanded="false" className="navbar-toggle collapsed" data-target="#navbar-collapse" data-toggle="collapse" type="button">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
              </button>
              <Link className="navbar-brand" to="/admin">
                  <img src="/img/logo-horizontal.svg" />
                  <h1 className="strong" style={{display: 'none'}}>Locust<span className="thin">Walk Admin</span></h1>
              </Link>
          </div>
          <div className="collapse navbar-collapse" id="navbar-collapse">
              <ul className="nav navbar-nav clean">
                  <li><Link to="/admin/features">Features</Link></li>
                  <li><Link to="/admin/topics">Topics</Link></li>
                  <li><Link to="/admin/articles">Articles</Link></li>
              </ul>
              <ul className="nav navbar-nav navbar-right clean">
                  <li><a href="/admin/logout">Log Out</a></li>
              </ul>
          </div>
      </div>
  </nav>
);

export default Navbar;
