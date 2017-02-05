
import React, { Component } from 'react'

export default class Optional extends Component {
    render() {
        return this.props.test ? <div>{this.props.children}</div> : null
    }
}

Optional.propTypes = {
    test: React.PropTypes.any
};