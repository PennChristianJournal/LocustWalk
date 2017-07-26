'use strict';

import {Component} from 'react';
import PropTypes from 'prop-types';
import {compose, graphql} from 'react-apollo';
import { editingContext } from './editing-context';
import {ARTICLE_QUERY} from '../gql/queries';
import {ARTICLE_UPDATE, ARTICLE_DELETE} from '../gql/mutations';

const editableArticleFields = [
  'title',
  'content',
  'slug',
  'author',
  'date',
  'is_published',
  'is_featured',
  'cover',
  'thumb',
  'parent',
  'topicID',
];

class ArticleEdit extends Component {
  render() {
    return !this.props.children ? null : this.props.children(this.props);
  }
}

ArticleEdit.propTypes = {
  children: PropTypes.func,
};

function getInputKey(key) {
  switch (key) {
    case 'topicID':
      return 'topic';
    default:
      return key;
  }
}

export default compose(
  graphql(ARTICLE_QUERY, {
    skip(props) {
      return !props._id;
    },
    options(props) {
      return {
        variables: {
          _id: props._id,
        },
      };
    },
    props({ data: { loading, article } }) {
      return {
        article,
        loading,
      };
    },
  }),
  graphql(ARTICLE_UPDATE, {
    name: 'updateArticle',
    props({ownProps, updateArticle}) {
      return {
        updateArticle: (article) => updateArticle({
          variables: {
            _id: ownProps._id,
            article,
          },
        }),
      };
    },
  }),
  graphql(ARTICLE_DELETE, {
    name: 'deleteArticle',
    props({ownProps, deleteArticle}) {
      return {
        deleteArticle: () => deleteArticle({
          variables: {
            _id: ownProps._id,
          },
        }),
      };
    },
  }),
  editingContext({
    createStage({article = {}}, stage = {}) {
      if (!article._id) {
        return {};
      } else if (article._id != stage._id) {
        return Object.assign({}, article);
      } else {
        return Object.assign({}, article, stage);
      }
    },
    props(ownProps, stage) {
      return {
        submit() {
          const params = stage.getChangedFields()
            .filter(key => editableArticleFields.includes(key))
            .reduce((obj, key) => {
              obj[getInputKey(key)] = stage.values[key];
              return obj;
            }, {});
          return ownProps.updateArticle(params);
        },
        cancel(cb) {
          stage.clear(cb);
        },
        delete() {
          return ownProps.deleteArticle();
        },
      };
    },
  }),
)(ArticleEdit);
