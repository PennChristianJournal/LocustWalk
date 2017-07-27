
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { articleHeading } from '../../helpers/article';
import {graphql, gql} from 'react-apollo';

class ArchivePanel extends Component {
  render() {
    return (
      <div className="tile tile-vertical gray-theme">
          <h2 className="strong"><a href="/archive">Archive</a></h2>
          <ul className="clean">
              {this.props.articles.map((article, i) => {
                return <li key={i}><a href={`/articles/${article.slug}`}>{articleHeading(article)}</a></li>;
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
    featuredArticles(limit: 12) {
      title
      slug
      date
      heading_override
    }
  }
`;

export default graphql(ARCHIVE_QUERY, {
  props({ data: { loading, featuredArticles } } ) {
    return {
      featuredArticles,
    };
  },
})( ({featuredArticles}) => {
  featuredArticles = featuredArticles || [];

  return <ArchivePanel articles={featuredArticles} />;
});
