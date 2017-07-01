'use strict'

import React, {Component} from 'react';
import $ from 'jquery';

class TypeaheadInput extends Component {

  componentDidMount() {
    var {createBloodhoundConfig, typeaheadConfig, target, targetField} = this.props;

    const search = createBloodhoundConfig(require('corejs-typeahead'));
    search.initialize();
    typeaheadConfig = Object.assign({}, typeaheadConfig, {
      source: search.ttAdapter(),
    });

    const $input = $(this.refs.input);
    $input.typeahead(null, typeaheadConfig);

    $input.on('typeahead:selected typeahead:autocompleted', (e, datum) => {
      $(target).val(datum[targetField]);
    });

    $('.tt-input').attr('autocomplete', 'off');
  }

  render() {
    var {createBloodhoundConfig, typeaheadConfig, target, targetField, ...otherProps} = this.props;

    return <input ref="input" {...otherProps} />;
  }
};

export default TypeaheadInput;
