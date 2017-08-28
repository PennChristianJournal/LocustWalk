
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {graphql, gql} from 'react-apollo';

class ArchivePanel extends Component {
  render() {
    return (
      <div className="tile tile-vertical gray-theme">
          <h2 className="strong"><a href="/archive">Archive</a></h2>
          <ul className="clean">
              {this.props.articles.map((article, i) => {
                return <li key={i}><a href={article.url}>{article.title}</a></li>;
              })}
          </ul>
      </div>
    );
  }
}

ArchivePanel.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ARCHIVE_QUERY = gql`
  query ArchiveQuery {
    recentArticles(limit: 24) {
      title
      url
    }
  }
`;

export default graphql(ARCHIVE_QUERY, {
  props({ data: { loading, recentArticles } } ) {
    return {
      recentArticles,
    };
  },
})( ({recentArticles}) => {
  recentArticles = recentArticles || [];

  return <ArchivePanel articles={recentArticles} />;
});
