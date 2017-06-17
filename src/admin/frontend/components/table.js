
import React, {Component} from 'react';
import {debounce} from 'underscore';

export default class Table extends Component {
  constructor(props) {
    super(props);
  }

  sizeHeader() {
    const headCells = this.refs.head.firstChild.cells;
    const bodyCells = (this.refs.body.firstChild || {}).cells || [];

    var length = Math.min(headCells.length, bodyCells.length);
    for (var i = 0; i < length; ++i) {
      headCells[i].style.width = bodyCells[i].offsetWidth + 'px';
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.sizeHeader.bind(this));
    this.sizeHeader();

    this.refs.body.addEventListener('mousewheel', debounce(function(e) {
      var {scrollTop, scrollHeight, offsetHeight} = this.refs.body;
      if (e.deltaY > 0 && scrollTop + offsetHeight > scrollHeight - 50) {
        if (this.props.onScrollBottom) {
          this.props.onScrollBottom();
        }
      }
    }.bind(this), 20, true));
  }

  componentDidUpdate() {
    this.sizeHeader();
  }

  render() {
    return (
      <table className={this.props.className}>
          <thead ref="head">{this.props.head}</thead>
          <tbody ref="body">{this.props.children}</tbody>
      </table>
    );
  }
}