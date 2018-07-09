import React, {Component} from 'react';
import classnames from 'classnames';
import Optional from '../../common/components/optional';

class Collapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed,
      collapsing: false,
      height: props.collapsed ? 0 : 'auto',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapsed != this.state.collapsed) {
      if (this.state.collapsed) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  open() {
    const height = this.refs.inner.clientHeight;
    this.setState({
      height: height,
      collapsing: true,
      collapsed: false,
    }, () => {
      setTimeout(() => {
        this.setState({
          height: 'auto',
          collapsing: false,
        });
      }, 300);
    });
  }

  close() {
    this.setState({
      height: this.refs.inner.clientHeight,
      collapsing: true,
      collapsed: true,
    }, () => {
      setTimeout(() => {
        this.setState({
          height: 0,
        }, () => {
          setTimeout(() => {
            this.setState({
              collapsing: false,
            });
          }, 300);
        });
      }, 1);
    });
  }

  render() {
    return (
      <div style={{
        overflow: 'hidden',
        transition: this.state.collapsing ? 'height ease 300ms' : undefined,
        height: this.state.height,
      }}>
        <div ref="inner">
          {this.props.children}
        </div>
      </div>
    )
  }
};

export default class AdminCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  render() {
    return (
      <div className={classnames('clearfix admin-cardgroup', this.props.className)}>
        <div className={classnames('admin-card', {
          'admin-card-disabled': this.props.disabled,
        })}>
          <Optional test={this.props.img}>
            <img className="admin-card-img" src={this.props.img} />
          </Optional>
          <div className="admin-card-body">
            <h5 className="card-title">
              {this.props.title}
            </h5>
            {this.props.children}
            {this.props.subcards && this.props.subcards.length ?
            <button className="btn btn-sm btn-link float-right"
              onClick={() => this.setState({collapsed: !this.state.collapsed})}
            >
              <i
                className="fa fa-chevron-down"
                style={{
                  transition: 'transform 100ms',
                  transform: this.state.collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                }}
              />
            </button> : null}
          </div>
          <Collapse collapsed={this.state.collapsed}>
            {this.props.subcards}
          </Collapse>
        </div>
      </div>
    );
  }
};
