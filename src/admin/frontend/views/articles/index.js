
import React, {Component} from 'react';
import AdminLayout from '~/admin/frontend/templates/admin-layout';
import ArticleEdit from '~/admin/frontend/components/article-edit';
import ArticleEditPanel from '~/admin/frontend/components/article-edit-panel';
import Modal from '~/admin/frontend/components/modal';
import Table from '~/admin/frontend/components/table';
import moment from 'moment';
import queryString from 'query-string';
import {debounce} from 'underscore';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

class ArticleList extends Component {

  render() {
    const {articles, setArticle} = this.props;

    return (
      <Table className="table table-striped" head={
          <tr>
              <th>Title</th>
              <th></th>
              <th>Topic</th>
              <th>Permalink</th>
              <th><i className="fa fa-check" /></th>
              <th>Posted</th>
          </tr>
      }>
          {articles.map((article, i) => {
            return (
              <tr key={i} onClick={() => setArticle(article) }>
                  <td><a href={`/articles/${article.slug}`}>{article.title}</a></td>
                  <td><a href={`/admin/articles/${article._id}/edit`} className="btn btn-default">Edit</a></td>
                  <td>{article.topic && article.topic.title}</td>
                  <td><a href={`/articles/${article._id}`}><i className="fa fa-link" /></a></td>
                  <td>{article.is_published ? <i className="fa fa-check" /> : null}</td>
                  <td>{moment(article.date).format('MMM DD, YYYY [at] H:mm')}</td>
              </tr>
            );
          })}
      </Table>
    );
  }
}

const ARTICLE_SEARCH_QUERY = gql`
  query SearchArticles($skip: Int!) {
    articles(limit: 10, skip: $skip) {
      _id
      title
      slug
      date
      is_published
      topic {
        title
      }
    }
    articleCount
  }
`;

const ArticleListWithData = graphql(ARTICLE_SEARCH_QUERY, {
  options: {
    variables: {
      skip: 0,
    },
    notifyOnNetworkStatusChange: true,
  },
  props({ ownProps, data: {loading, articles, articleCount, fetchMore } }) {
    articles = articles || [];
    return {
      ...ownProps,
      loading,
      articles: articles || [],
      hasMore() {
        return articles.length < articleCount;
      },
      loadMore() {
        if (loading) {
          return;
        }
        return fetchMore({
          variables: {
            skip: articles.length,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return Object.assign({}, previousResult, {
              articles: [...previousResult.articles, ...fetchMoreResult.articles],
            });
          },
        });
      },
    };
  },
})(ArticleList);

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
        this.loadMoreArticles();
      }
    }, 20, true));

    this.loadMoreArticles();
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

    if ((bodyShort || atBottom) && this.refs.articleList.renderedElement.props.hasMore()) {
      let loaded = this.refs.articleList.renderedElement.props.loadMore();
      if (loaded) {
        loaded.then(this.loadMoreArticles.bind(this));
      }
    }
  }

  render() {
    return (
      <AdminLayout id="admin-page" ref="admin-layout">
        <ArticleEdit _id={this.state.article && this.state.article._id}>
          {(props) => {
            return (
              <Modal
                isOpen={this.state.article}
                title={`Editing - ${props.stage.values.title}`}
                confirmClose={() => {
                  return !props.stage.hasChangedFields() || confirm(`Are you sure you want to cancel editing "${props.stage.values.title}"? Unsaved changes will be lost!`);
                }}
                onClose={() => {
                  this.setState({
                    article: null,
                  });
                }}>

                  <ArticleEditPanel
                    imagePreviews
                    {...props}
                    onCancel={() => {
                      this.setState({
                        article: null,
                      });
                    }}
                    onDelete={() => {
                      this.setState({
                        article: null,
                      });
                    }}
                    onSubmit={() => {
                      this.setState({
                        article: null,
                      });
                    }}
                  />
              </Modal>
            );
          }}
        </ArticleEdit>

        <div className="container" style={{height: '100%'}}>
            <div className="admin-list-view">
                <div className="admin-list-header">
                    <h1>
                        <span>Articles</span>
                        <a className="pull-right btn btn-primary" href="/admin/articles/new">New Article</a>
                    </h1>
                </div>
                <div className="admin-list-content" ref="list">
                    <ArticleListWithData ref="articleList" setArticle={this.setArticle.bind(this)} />
                </div>
            </div>
        </div>
      </AdminLayout>
    );
  }
}
