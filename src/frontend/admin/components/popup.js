
import React, {Component} from 'react';
import {createPortal} from 'react-dom';

const zIndices = [1050];

export default class Popup extends Component {
  constructor(props) {
    super(props);

    if (typeof document !== 'undefined') {
      this.el = document.createElement('div');
      this.el.className = 'popup';
      this.root = document.getElementById('popup-root');
    }
  }

  open() {
    if (!this.zIndex) {
      this.zIndex = zIndices[zIndices.length - 1] + 1;
      zIndices.push(this.zIndex);
      this.el.style.zIndex = this.zIndex;
    }
  }

  close() {
    if (this.zIndex) {
      zIndices.splice(zIndices.indexOf(this.zIndex));
      this.zIndex = undefined;
    }
  }

  componentWillMount() {
    if (typeof document !== 'undefined') {
      this.root.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    this.close();
    this.root.removeChild(this.el);
  }

  render() {
    return this.el ? createPortal(this.props.children, this.el) : null;
  }
};
