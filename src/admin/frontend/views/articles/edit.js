
import React, {Component} from 'react';
import AdminLayout from '~/admin/frontend/templates/admin-layout';
import ArticleMain from '~/common/frontend/components/article-main';
import ArticleThumb from '~/common/frontend/components/article-thumb';
import ArticleLayout from '~/common/frontend/templates/article-layout';
import ArticleEdit from '~/admin/frontend/components/article-edit';
import ArticleEditPanel from '~/admin/frontend/components/article-edit-panel';
import MediumEditorInsertPlugin from 'medium-editor-insert-plugin';
import $ from 'jquery';
import {headData} from '~/common/frontend/head';

class ArticleEditor extends Component {
  constructor(props) {
    super(props);
    this.contentEditor = undefined;
  }

  componentDidMount() {
    const MediumEditor = require('medium-editor');
    MediumEditorInsertPlugin($);

    var contentDiv = $(`div[data-article-id="${this.props.article._id}"] .article-content`);

    this.contentEditor = new MediumEditor(contentDiv, {
      placeholder: {
        text: 'Article content...',
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

    this.contentEditor.subscribe('blur', () => {
      this.props.stage.update('content', this.contentEditor.serialize()['element-0'].value);
    });

    contentDiv.mediumInsert({
      editor: this.contentEditor,
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

  render() {
    return <ArticleMain article={this.props.article} />;
  }
}

class ArticlePreviews extends Component {
  render() {
    const article = this.props.article;

    return (
      <div className="container">
        <div className="row">
          <div className="tile tile-vertical white-theme">
            <ArticleThumb article={article} />
          </div>
        </div>
      </div>
    );
  }
}

class ArticleEditPage extends Component {
  getArticleContent() {
    return this.articleEdit.contentEditor.serialize()['element-0'].value;
  }

  render() {
    const id = this.props._id || (typeof window !== 'undefined' && (segments => segments[segments.length - 2])(window.location.pathname.split('/')));
    return (
      <AdminLayout>
        <ArticleEdit _id={id}>
          {props => {
            return (
              <div>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-12">
                      <div className="row">
                        <ArticleEditPanel
                          getArticleContent={this.getArticleContent.bind(this)}
                          gdriveSync
                          imagePreviews
                          {...props}
                          onCancel={() => window.location = '/admin/articles'}
                          onDelete={() => window.location = '/admin/articles'}
                        />
                      </div>
                    </div>

                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <ArticlePreviews article={props.stage.values} />
                      <ArticleLayout>
                        <ArticleEditor stage={props.stage} article={props.stage.values} ref={(el) => this.articleEdit = el} />
                      </ArticleLayout>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </ArticleEdit>
      </AdminLayout>
    );
  }
}

export default headData(head => {
  head.addLink([
    {
      href: '/css/home.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/bower_components/medium-editor/dist/css/medium-editor.min.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/bower_components/medium-editor-insert-plugin/dist/css/medium-editor-insert-plugin.min.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ]);
})(ArticleEditPage);
