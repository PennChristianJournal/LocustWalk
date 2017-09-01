
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

export default class ContentEditor extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.contentEditor = this.contentEditor && this.contentEditor.destroy();

    const MediumEditor = require('medium-editor');

    this.contentEditor = new MediumEditor($(this.refs.container), {
      placeholder: {
        text: this.props.placeholder,
        hideOnClick: false,
      },
      toolbar: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'anchor',
          'h2',
          'h3',
          'quote',
          'superscript',
          'justifyLeft',
          'justifyCenter',
          'justifyRight',
          'justifyFull',
        ],
      },
    });

    this.contentEditor.subscribe('blur', (event, editable) => {
      if (this.props.onChange) {
        this.props.onChange(this.contentEditor.serialize()['element-0'].value);
      }
    });
  }

  componentWillUnmount() {
    this.contentEditor = this.contentEditor && this.contentEditor.destroy();
  }

  render() {
    return <div ref="container" dangerouslySetInnerHTML={{__html: this.props.content}}></div>;
  }
}

ContentEditor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};
