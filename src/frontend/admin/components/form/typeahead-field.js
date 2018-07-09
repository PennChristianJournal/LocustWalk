import React, {Component} from 'react';
import $ from 'jquery';

class TypeaheadField extends Component {

  componentDidMount() {
    var {createBloodhoundConfig, typeaheadConfig} = this.props;

    const search = createBloodhoundConfig(require('corejs-typeahead'), $);
    search.initialize();
    typeaheadConfig = Object.assign({}, typeaheadConfig, {
      source: search.ttAdapter(),
    });

    const $input = $(this.refs.input);
    $input.typeahead(null, typeaheadConfig);

    $input.on('typeahead:selected typeahead:autocompleted', (e, datum) => this.props.onChange(datum));

    $('.tt-input').attr('autocomplete', 'off');
  }

  render() {
    const props = Object.assign({}, this.props);
    delete props.createBloodhoundConfig;
    delete props.typeaheadConfig;
    delete props.onChange;
    delete props.children;

    return (
      <div className="form-group">
        <label>{props.label}</label>
        <div className="input-group">
          <input ref="input" {...props} />
          <div className="input-group-append">
            <button className="btn btn-outline-danger" onClick={(e) => {
              e.preventDefault();
              this.refs.input.value = null;
              this.props.onChange(null);
            }}><i className="fa fa-close" /></button>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default TypeaheadField;
