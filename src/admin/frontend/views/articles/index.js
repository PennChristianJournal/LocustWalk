
import React, {Component} from 'react';
import AdminLayout from '~/admin/frontend/templates/admin-layout';
import ArticleGroupInfinite from '~/common/frontend/components/article-group-infinite';
import ArticleEditPanel from '~/admin/frontend/components/article-edit-panel';
import Table from '~/admin/frontend/components/table';
import moment from 'moment';
import queryString from 'query-string';
import {debounce} from 'underscore';

export default class ArticleListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: props.sort || 'date',
      page: props.page || 1,
      article: null,
    };
  }

  componentDidMount() {
    var params = queryString.parse(location.search);
    this.setState({
      sort: params.sort || this.state.sort,
      page: params.page || this.state.page,
    });

    const container = this.refs.list;
    const table = container.childNodes[0];
    table.addEventListener('mousewheel', debounce((e) => {
      if (e.deltaY > 0 && table.scrollTop + table.offsetHeight > table.scrollHeight - 50) {
        this.loadMoreArticles(true);
      }
    }, 20, true));
  }

  fetchArticles(cb) {
    this.refs.articles.getWrappedInstance().fetchMore(cb);
  }

  hasMoreArticles() {
    return this.refs.articles.getWrappedInstance().hasMore();
  }

  setArticle(article) {
    this.setState({
      article,
    });
  }

  loadMoreArticles() {
    const container = this.refs.list;
    const table = container.childNodes[0];
    const body = table.childNodes[1];
    const tableBottom = table.offsetTop + table.offsetHeight;
    const bodyBottom = body.offsetTop + body.offsetHeight;

    const atBottom = table.scrollTop + table.offsetHeight > table.scrollHeight - 50;
    const bodyShort = bodyBottom < tableBottom;

    if ((bodyShort || atBottom) && this.hasMoreArticles()) {
      this.fetchArticles(this.loadMoreArticles.bind(this));
    }
  }

  render() {
    return (
      <AdminLayout id="admin-page" sidebar={<ArticleEditPanel imagePreviews article={this.state.article} />} sidebarOpen={this.state.article} >
          <div className="admin-list-view">
              <div className="admin-list-header">
                  <h1>
                      <span>Articles</span>
                      <a className="pull-right btn btn-primary" href="/admin/articles/new">New Article</a>
                  </h1>
              </div>
              <div className="admin-list-content" ref="list">
                  <ArticleGroupInfinite initialPages={1} ref="articles" name="articles" query={{
                    sort: this.state.sort,
                    limit: 10,
                  }}
                  initialLoad={this.loadMoreArticles.bind(this)}>
                      {articles => (
                          <Table className="table table-striped" head={
                              <tr>
                                  <th>Title</th>
                                  <th></th>
                                  <th><i className="fa fa-star" /></th>
                                  <th><i className="fa fa-check" /></th>
                                  <th>Posted</th>
                              </tr>
                          }>
                              {articles.map((article, i) => {
                                return (
                                  <tr key={i} onClick={() => this.setArticle(article) }>
                                      <td><a href={`/admin/articles/${article._id}/edit`} dangerouslySetInnerHTML={{__html: article.title}}></a></td>
                                      <td><a href={`/articles/${article._id}`}><i className="fa fa-link" /></a></td>
                                      <td>{article.is_featured ? <i className="fa fa-star" /> : null}</td>
                                      <td>{article.is_published ? <i className="fa fa-check" /> : null}</td>
                                      <td>{moment(article.date).format('MMM DD, YYYY [at] H:mm')}</td>
                                  </tr>
                                );
                              })}
                          </Table>
                      )}
                  </ArticleGroupInfinite>
              </div>
          </div>
      </AdminLayout>
    );
  }
}

ArticleListPage.metadata = Object.assign({}, AdminLayout.metadata);
