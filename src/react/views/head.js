
import React, { Component } from 'react'
import { connect } from 'react-redux'

class Head extends Component {
    render() {
        return (
            <head>
                <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />

                <meta property="og:site_name" content="Penn Christian Journal"></meta>

                <title>{this.props.title}</title>
                <meta property="og:title" content={this.props.title}></meta>
                <meta property="twitter:title" content={this.props.title}></meta>

                <link href="https://fonts.googleapis.com/css?family=Lato:900,400,400italic,700,300" rel="stylesheet" type="text/css" />
                <link href="https://fonts.googleapis.com/css?family=Roboto:400,400italic,700" rel="stylesheet" type="text/css" />
                <link href="/bower_components/normalize-css/normalize.css" rel="stylesheet" type="text/css" />
                <link href="/bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
                <link href="/bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
                <link href="/css/main.css" rel="stylesheet" type="text/css" />
            </head>
        )
    }
}

export default connect(state => {
    return Object.assign({}, state.metadata);
})(Head)