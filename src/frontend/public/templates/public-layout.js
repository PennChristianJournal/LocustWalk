import React from 'react';
import { Helmet } from 'react-helmet';
import Link from 'react-router-dom/Link';
import { renderRoutes } from 'react-router-config';
import classnames from 'classnames';
import Navbar from '../../common/components/navbar';

const Styles = () => (
  <Helmet>
    <link href="/img/favicon.ico" rel="icon" type="image/x-icon" />
    <link href="https://fonts.googleapis.com/css?family=Lato:900,400,400italic,700,300" rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,400italic,700" rel="stylesheet" type="text/css" />
    <link href="/bower_components/normalize-css/normalize.css" rel="stylesheet" type="text/css" />
    <link href="/bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <link href="/bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="/bower_components/medium-editor/dist/css/themes/default.css" rel="stylesheet" type="text/css" />
    <link href="/bower_components/medium-editor-insert-plugin/dist/css/medium-editor-insert-plugin.min.css" rel="stylesheet" type="text/css" />
    <link href="/css/common.css" rel="stylesheet" type="text/css" />
    <link href="/css/public.css" rel="stylesheet" type="text/css" />
  </Helmet>
);

const PublicLayout = ({route, className}) => [
  <Styles key="styles" />,
  <div className={className} key="container">
    <Navbar
      className={classnames('navbar-expand-md', {
        'navbar-light': className.indexOf('article-layout') < 0,
        'navbar-dark': className.indexOf('article-layout') >= 0,
      })}
      brand={
        <Link to="/">
          <img src="/img/logo-horizontal.svg" />
          <h1 className="strong" style={{display: 'none'}}>Locust<span className="thin">Walk</span></h1>
        </Link>
      }
      links={[
        <Link to="/about">About</Link>,
        <Link to="/staff">Staff</Link>,
        <Link to="/submissions">Submissions</Link>,
        <Link to="/subscribe">Subscribe</Link>,
      ]} />

    <main>{renderRoutes(route.routes)}</main>

    <footer>
      <script type="text/javascript" src="/js/manifest.js"></script>
      <script type="text/javascript" src="/js/react.js"></script>
      <script type="text/javascript" src="/js/publicApp.js"></script>
    </footer>
  </div>
];

export default PublicLayout;
