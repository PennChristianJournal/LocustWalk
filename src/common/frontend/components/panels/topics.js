
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {graphql, gql} from 'react-apollo';

class TopicsPanel extends Component {
  render() {
    return (
      <div className="tile tile-vertical gray-theme">
          <h2 className="strong">Topics</h2>
          <ul className="clean">
              {this.props.topics.map(topic => {
                return <li key={topic._id}><a href={topic.url}>{topic.title}</a></li>;
              })}
          </ul>
      </div>
    );
  }
}

TopicsPanel.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const TOPICS_QUERY = gql`
  query TopicsQuery {
    topics(is_published: true) {
      _id
      title
      url
    }
  }
`;

export default graphql(TOPICS_QUERY, {
  props({ data: { loading, topics } } ) {
    return {
      topics,
    };
  },
})( ({topics}) => {
  topics = topics || [];

  return <TopicsPanel topics={topics} />;
});
