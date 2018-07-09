import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Switch from 'react-router/Switch';
import Route from 'react-router/Route';
import {Link, withRouter} from 'react-router-dom';
import MediumEditorInsertPlugin from 'medium-editor-insert-plugin';
import $ from 'jquery';
import pretty from 'pretty';
import classnames from 'classnames';
import Modal from '../modal';
import {htmlPreview} from '../../../../graphql/helpers';

class MediumEditor extends Component {
  componentDidMount() {
    const MediumEditor = require('medium-editor');
    MediumEditorInsertPlugin($);

    const $content = $(this.refs.content);
    this.editor = new MediumEditor($content, {
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
          'removeFormat',
        ],
      },
    });

    $content.mediumInsert({
      editor: this.editor,
      addons: {
        images: {
          fileUploadOptions: {
            url: 'imageupload',
            acceptFileTypes: /(.|\/)(gif|jpe?g|png)$/i,
          },
          deleteScript: 'imagedelete',
          deleteMethod: 'POST',
        },
      },
    });
  }

  getContent() {
    return this.editor.serialize()['element-0'].value;
  }

  componentWillUnmount() {
    this.editor.destroy();
  }

  render() {
    return <div ref="content" dangerouslySetInnerHTML={{__html: this.props.content}} />;
  }
};

class HTMLEditor extends Component {

  componentDidMount() {
    this.resizeTextarea();
  }

  resizeTextarea() {
    this.refs.textarea.style.height = "5px";
    this.refs.textarea.style.height = this.refs.textarea.scrollHeight + "px";
  }

  getContent() {
    return this.refs.textarea.value;
  }

  render() {
    return (
      <div className="form-group">
        <textarea
          ref="textarea"
          style={{
            resize: 'none',
            overflow: 'hidden',
            minHeight: '50px',
            border: 'none',
          }}
          onChange={this.resizeTextarea.bind(this)}
          className="form-control"
          defaultValue={pretty(this.props.content, {ocd: true})} />
      </div>
    );
  }
};

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state= {
      editorMode: 'medium',
    };
  }

  setEditorMode(editorMode) {
    this.setState({
      content: this.refs.editor.getContent(),
      editorMode,
    });
  }

  getContent() {
    if (this.refs.editor) {
      return this.refs.editor.getContent();
    }
    return this.state.content || this.props.content;
  }

  render() {
    let EditorComponent;
    switch(this.state.editorMode) {
      case 'medium': EditorComponent = MediumEditor; break;
      case 'html': EditorComponent = HTMLEditor; break;
    }

    return (
      <Fragment>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className={classnames('nav-link', { active: this.state.editorMode === 'medium'})} href="#" onClick={this.state.editorMode !== 'medium' ? this.setEditorMode.bind(this, 'medium') : undefined}>Rich Text</a>
          </li>
          <li className="nav-item">
            <a className={classnames('nav-link', { active: this.state.editorMode === 'html'})} href="#" onClick={this.state.editorMode !== 'html' ? this.setEditorMode.bind(this, 'html') : undefined}>HTML</a>
          </li>
        </ul>
        <EditorComponent ref="editor" content={this.getContent()} />
      </Fragment>
    );
  }
};

class MediumField extends Component {

  handleClose() {
    if (this.props.history.action === 'PUSH') {
      this.props.history.goBack();
    } else {
      this.props.history.replace({
        pathname: this.props.match.url,
        search: this.props.location.search,
      });
    }
  }

  handleFinish(e) {
    e.preventDefault();
    this.props.onChange(this.editor.getContent());
    this.handleClose();
  }

  handleCancel(e) {
    e.preventDefault();
    this.handleClose();
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <link href="/bower_components/medium-editor/dist/css/medium-editor.min.css" rel="stylesheet" type="text/css" />
          <link href="/bower_components/medium-editor-insert-plugin/dist/css/medium-editor-insert-plugin.min.css" rel="stylesheet" type="text/css" />
        </Helmet>

        <div className="form-group clearfix">
          <p dangerouslySetInnerHTML={{__html: htmlPreview(this.props.content, 300, true)}} />
          <Link className="btn btn-outline-primary float-right" to={`${this.props.match.url}/${this.props.name}${this.props.location.search}`}>{this.props.label}</Link>
        </div>
        <Switch>
          <Route path={`${this.props.match.url}/${this.props.name}`} render={(props) => (
            <Modal size="modal-lg" isOpen={true} title={this.props.label} onClose={this.handleClose.bind(this)}
              footer={
                <Fragment>
                  <a href="#" className="btn btn-primary" onClick={this.handleFinish.bind(this)}>Finish</a>
                  <a href="#" className="btn btn-light" onClick={this.handleCancel.bind(this)}>Cancel</a>
                </Fragment>
              }
            >
              <Editor ref={(editor) => this.editor = editor} placeholder={this.props.placeholder} content={this.props.content} />
            </Modal>
          )} />
          <Route render={() => <Modal size="modal-lg" isOpen={false} />}/>
        </Switch>
      </Fragment>
    );
  }
};

export default withRouter(MediumField);
