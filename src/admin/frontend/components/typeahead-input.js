'use strict';

import React, {Component} from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import $ from 'jquery';

export default class TypeaheadInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
  }

  render() {
    let matches = this.props.query.match(/query ([a-zA-Z]+)[\s\S]*?{[\s\S]*?([a-zA-Z]+)/);
    const {getVariables, query, ...otherProps} = this.props;

    return (
      <AsyncTypeahead
        {...otherProps}
        onSearch={search => {
          let data = {
            operationName: matches[1],
            query,
            variables: getVariables(search),
          };
          $.ajax({
            type: 'POST',
            url: '/graphql',
            contentType: 'application/json',
            data: JSON.stringify(data),
          }).then(({data}) => {
            this.setState({
              options: data[matches[2]],
            });
          });
        }}
        options={this.state.options}
      />
    );
  }
}