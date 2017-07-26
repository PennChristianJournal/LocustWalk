'use strict';

import React, {Component} from 'react';
import $ from 'jquery';

class TypeaheadInput extends Component {

  registerTarget(target) {
    const $input = $(this.refs.input);
    $input.on('typeahead:selected typeahead:autocompleted', (e, datum) => {
      if (typeof target === 'function') {
        target(datum[this.props.targetField], datum);
      } else {
        $(target).val(datum[this.props.targetField]);
      }
    });
  }

  componentDidMount() {
    var {createBloodhoundConfig, typeaheadConfig, target} = this.props;

    const search = createBloodhoundConfig(require('corejs-typeahead'));
    search.initialize();
    typeaheadConfig = Object.assign({}, typeaheadConfig, {
      source: search.ttAdapter(),
    });

    const $input = $(this.refs.input);
    $input.typeahead(null, typeaheadConfig);

    this.registerTarget(target);

    $('.tt-input').attr('autocomplete', 'off');
  }

  componentWillReceiveProps({target}) {
    if (target && target != this.props.target) {
      this.registerTarget(target);
    }
  }

  render() {
    const props = Object.assign({}, this.props);
    delete props.createBloodhoundConfig;
    delete props.typeaheadConfig;
    delete props.target;
    delete props.targetField;

    return <input ref="input" {...props} />;
  }
}

export default TypeaheadInput;
