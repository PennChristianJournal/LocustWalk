
import { Component } from 'react';
import PropTypes from 'prop-types';

export default class Optional extends Component {
  render() {
    return this.props.test ? this.props.children : null;
  }
}

Optional.propTypes = {
  test: PropTypes.any,
};
