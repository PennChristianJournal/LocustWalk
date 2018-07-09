
import React, {Component} from 'react';

export default class PanelPage extends Component {
  render() {
    return (
      <div className="panel-page" id={this.props.id}>
          <div className="container">
              <div className="row">
                  <div className="col-lg-12" id="top">{
                      React.Children.map(this.props.top, (component, i) => {
                        return React.cloneElement(component, {
                          key: i,
                        });
                      })
                  }</div>
              </div>
              <div className="row">
                  <div className="col-lg-12">
                      <div className="row">
                          <div className="col-lg-9 col-md-8" id="main">{
                            React.Children.map(this.props.main, (component, i) => {
                              return React.cloneElement(component, {
                                key: i,
                              });
                            })
                          }</div>
                          <div className="col-lg-3 col-md-4" id="side">{
                              React.Children.map(this.props.side, (component, i) => {
                                return React.cloneElement(component, {
                                  key: i,
                                });
                              })
                          }</div>
                      </div>
                  </div>
              </div>
              <div className="row">
                  <div className="col-lg-12" id="bottom">{
                      React.Children.map(this.props.bottom, (component, i) => {
                        return React.cloneElement(component, {
                          key: i,
                        });
                      })
                  }</div>
              </div>
          </div>
      </div>
    );
  }
}
