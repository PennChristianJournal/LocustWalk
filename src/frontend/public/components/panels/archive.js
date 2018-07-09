
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

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
    articles(limit: 24) {
      title
      url
    }
  }
`;

export default graphql(ARCHIVE_QUERY, {
  props({ data: { loading, articles } } ) {
    return {
      articles,
    };
  },
})( ({articles}) => {
  articles = articles || [];

  return <ArchivePanel articles={articles} />;
});
