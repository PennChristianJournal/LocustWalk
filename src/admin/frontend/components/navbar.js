
import React from 'react';

export default () => (
  <nav className="navbar navbar-fixed-top">
      <div className="container">
          <div className="navbar-header">
              <button aria-expanded="false" className="navbar-toggle collapsed" data-target="#navbar-collapse" data-toggle="collapse" type="button">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
              </button>
              <a className="navbar-brand" href="/admin">
                  <img src="/img/logo-horizontal.svg" />
                  <h1 className="strong" style={{display: 'none'}}>Locust<span className="thin">Walk Admin</span></h1>
              </a>
          </div>
          <div className="collapse navbar-collapse" id="navbar-collapse">
              <ul className="nav navbar-nav clean">
                  <li><a href="/admin/features">Features</a></li>
                  <li><a href="/admin/topics">Topics</a></li>
                  <li><a href="/admin/articles">Articles</a></li>
              </ul>
              <ul className="nav navbar-nav navbar-right clean">
                  <li><a href="/admin/logout">Log Out</a></li>
              </ul>
          </div>
      </div>
  </nav>
);
