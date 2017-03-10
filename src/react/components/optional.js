
import React, { Component } from 'react'

export default class Optional extends Component {
    render() {
        return this.props.test ? this.props.children : null
    }
}

Optional.propTypes = {
    test: React.PropTypes.any
};