import React, {Component} from 'react';
import ReactDatetime from 'react-datetime';
import {defaultValue} from '../../../common/helpers';

export default class DatetimeField extends Component {
  componentWillMount() {
    this.setState({
      dateNow: Date.now(),
    });
  }

  componentDidMount() {
    this.timerID = this.props.defaultNow && setInterval(() => this.tick(), 10000);
  }

  tick() {
    this.setState({
      dateNow: Date.now(),
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    const {label, defaultNow, value, ...props} = this.props;
    return (
      <div className="form-group">
        <label>{label}</label>
        <ReactDatetime {...props} value={defaultNow && defaultValue(value, this.state.dateNow)} />
      </div>
    )
  }
};
