
import React, {Component} from 'react';
import ArticleGroup from '../../../components/article-group';
import ArticleMain from '../../../components/article-main';
import ArticleThumb from '../../../components/article-thumb';
import ArticleLayout from '../../../templates/article-layout';
import ArticleSidebar from '../../../components/admin/article-sidebar';
import MediumEditorInsertPlugin from 'medium-editor-insert-plugin';
import $ from 'jquery';

class ArticleEdit extends Component {
  componentDidMount() {
    const MediumEditor = require('medium-editor');
    MediumEditorInsertPlugin($);

    var contentDiv = $(`div[data-article-id="${this.props.article._id}"] .article-content`);

    var contentEditor = new MediumEditor(contentDiv, {
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
      editor: contentEditor,
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
  render() {
    return (
      <ArticleGroup name="main">
          {articles => {
            const article = articles[0];
            return (
              <div className="container-fluid">
                  <div className="row">
                      <div className="col-lg-3 col-sm-4 col-xs-6">
                          <div className="row">
                              <ArticleSidebar article={article} gdriveSync />
                          </div>
                      </div>
                      <div className="col-lg-9 col-sm-8 col-xs-6">
                          <div className="row">
                              <ArticleThumb article={article} />
                          </div>
                          <div className="row"><br /></div>
                          <div className="row">
                              <ArticleLayout>
                                  <ArticleEdit article={article} />  
                              </ArticleLayout>
                          </div>
                      </div>
                  </div>
              </div>
            );
          }}
      </ArticleGroup>
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
      href: '/css/admin-sidebar.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ],
};

import {mount} from '../../../helpers/page';
mount(ArticleEditPage);
