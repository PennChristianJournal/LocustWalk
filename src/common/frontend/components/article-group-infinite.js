
import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchArticlesIfNeeded } from '../actions/articles';
import { countArticles } from '../actions/articles';
import Promise from 'bluebird';

class ArticleGroupInfinite extends Component {

  fetchMore(cb) {
    this.props.fetchPage(this.props.pages + 1, cb);
  }

  hasMore() {
    return (this.props.articles || []).length < this.props.count || 0;
  }

  componentDidMount() {
    this.props.getCount();
    this.props.fetchPage(Math.max(this.props.pages, this.props.initialPages), this.props.initialLoad);
  }

  render() {
    if (!this.props.articles) {
      return null;
    }
    return this.props.children(this.props.articles, this);
  }
}

ArticleGroupInfinite.propTypes = {
  children: PropTypes.func.isRequired,
};

export default connect((state, ownProps) => {
  const group = state.articles[ownProps.name] || [];

  return {
    articles: group
      .map(pagegroup => pagegroup.articles || [])
      .reduce((a, b) => a.concat(b), [])
      .map(id => state.articles.__DB__[id]),

    pages: group.length,

    count: group.count || 0,
  };

}, (dispatch, ownProps) => {
  return {
    fetchPage: (page, cb) => {
      var promises = [];
      for (let i = 0; i < page; ++i) {
        promises.push(dispatch(fetchArticlesIfNeeded(ownProps.name, i, ownProps.query)));
      }
      if (cb) {
        Promise.all(promises).then(cb);
      }
    },
    getCount: () => {
      dispatch(countArticles(ownProps.name, ownProps.query));
    },
  };
}, null, {
  withRef: true,
})(ArticleGroupInfinite);
