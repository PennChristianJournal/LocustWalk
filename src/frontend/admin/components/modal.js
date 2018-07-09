'use strict';

import React, {Component} from 'react';
import Optional from '../../common/components/optional';
import Popup from './popup';
import classnames from 'classnames';

var MODAL_OPEN_COUNT = 0;

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isHidden: true,
      opening: false,
    };
    this.counted = false;
  }

  increaseModalCount() {
    if (!this.counted) {
      this.counted = true;
      MODAL_OPEN_COUNT++;
      document.body.style.overflow = 'hidden';
    }
  }

  decreaseModalCount() {
    if (this.counted) {
      this.counted = false;
      MODAL_OPEN_COUNT--;
      if (MODAL_OPEN_COUNT === 0) {
        document.body.style.overflow = '';
      }
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.state.isOpen) {
      if (nextProps.isOpen) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  open() {
    this.refs.popup.open();
    this.increaseModalCount();
    this.setState({
      isHidden: false,
      opening: true,
    }, () => {
      process.nextTick(() => {
        this.setState({
          isOpen: true,
        });
      });
      setTimeout(() => {
        this.setState({
          opening: false,
        });
      }, 300);
    });
  }

  close() {
    this.refs.popup.close();
    this.setState({
      isOpen: false,
      opening: true,
    }, () => {
      this.decreaseModalCount();
      setTimeout(() => {
        this.setState({
          isHidden: true,
          opening: false,
        });
      }, 300);
    });
  }

  componentWillUnmount() {
    this.decreaseModalCount();
  }

  handleClose() {
    if (!this.props.confirmClose || this.props.confirmClose()) {
      if (this.props.onClose) {
        this.props.onClose();
      }
      this.close();
    }
  }

  render() {

    return (
      <Popup ref="popup">
        <div className={classnames({
          'modal-open': !this.state.isHidden,
        })}>
          <div className={classnames('modal fade', {
            'show': this.state.isOpen,
          })} style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: !this.state.isHidden ? 'block' : 'none',
          }}>
            <div className={classnames('modal-dialog', this.props.size)} style={{
              width: this.props.width ? this.props.width : undefined,
            }}>
              <div className="modal-content">
                <div className="modal-header">
                  <Optional test={this.props.title}>
                    <h4 className="modal-title">{this.props.title}</h4>
                  </Optional>
                  <button type="button" className="close" onClick={this.handleClose.bind(this)}><span>&times;</span></button>
                </div>
                <div className="modal-body">
                  {this.props.children}
                </div>
                <div className="modal-footer">
                  {this.props.footer}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    );
  }

}

export default Modal;
