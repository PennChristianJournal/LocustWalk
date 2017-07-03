
import React, {Component} from 'react';
import PageLayout from '~/common/frontend/templates/page-layout';
import AdminLayout from '~/admin/frontend/templates/admin-layout';
import ArticleGroup from '~/common/frontend/components/article-group';
import FeatureSlider from '~/common/frontend/components/feature-slider';
import ArticleMain from '~/common/frontend/components/article-main';
import ArticleThumb from '~/common/frontend/components/article-thumb';
import ArticleLayout from '~/common/frontend/templates/article-layout';
import Optional from '~/common/frontend/components/optional';
import ArticleEditPanel from '~/admin/frontend/components/article-edit-panel';
import MediumEditorInsertPlugin from 'medium-editor-insert-plugin';
import Modal from '~/admin/frontend/components/modal';
import $ from 'jquery';

class ArticleEdit extends Component {
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

export default class ArticleEditPage extends Component {
  getArticleContent() {
    return this.articleEdit.contentEditor.serialize()['element-0'].value;
  }

  render() {
    return (
      <AdminLayout>
        <ArticleGroup name="main">
            {articles => {
              const article = articles[0] || {};
              return (
                <div>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-12">
                          <div className="row">
                            <ArticleEditPanel 
                              article={article} 
                              getArticleContent={this.getArticleContent.bind(this)} 
                              gdriveSync 
                              imagePreviews
                              onCancel={() => window.location = '/admin/articles'}
                              onDelete={() => window.location = '/admin/articles'}
                            />
                          </div>
                        </div>

                        <div className="col-lg-9 col-md-8 col-sm-12">
                          <div className="container-fluid">
                            <Optional test={article.is_featured}>
                                <div className="row">
                                  <div className="col-lg-12">
                                    <FeatureSlider articles={[article]} />
                                  </div>
                                </div>
                              </Optional>
                              <div className="tile tile-vertical white-theme">
                                  <ArticleThumb article={article} />
                              </div>
                            </div>
                            <ArticleLayout>
                                <ArticleEdit ref={(el) => this.articleEdit = el} article={article} />
                            </ArticleLayout>
                          </div>
                        </div>
                      </div>
                </div>
              );
            }}
        </ArticleGroup>
      </AdminLayout>
    );
  }
}

ArticleEditPage.metadata = {
  link: [
    {
      href: '/bower_components/medium-editor/dist/css/medium-editor.min.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/bower_components/medium-editor/dist/css/themes/default.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/bower_components/medium-editor-insert-plugin/dist/css/medium-editor-insert-plugin.min.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/article.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/article-thumb.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/article-discussion.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/home.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/admin.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/admin-sidebar.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ],
};
