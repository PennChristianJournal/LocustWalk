'use strict';

import {Component} from 'react';
import PropTypes from 'prop-types';
import {compose, graphql, gql} from 'react-apollo';

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
];

const articleFields = [
  ...editableArticleFields,
  '_id',
  'preview',
];

class ArticleEdit extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.article);
    
    this.actions = {
      updateArticle: (field, value, cb) => {
        this.setState({
          [field]: value,
        }, cb);
      },
      submitArticle: () => {
        const params = Object.keys(this.state)
          .filter(key => editableArticleFields.includes(key))
          .filter(key => this.state[key] != this.props.article[key])
          .reduce((obj, key) => {
            obj[key] = this.state[key];
            return obj;
          }, {});
        return this.props.submit(params);
      },
      cancelArticle: () => {
        this.setState(this.props.article);
      },
      deleteArticle: () => {
        return this.props.delete(this.props.article._id);
      },
    };
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.article || {});
  }
  render() {
    return this.props.loading ? null : this.props.children(this.state, this.actions);
  }
}

ArticleEdit.propTypes = {
  children: PropTypes.func.isRequired,
};

export const ARTICLE_QUERY = gql`
  query FullArticle($_id: ObjectID!) {
    article(_id: $_id) {
      ${articleFields.join('\n')}
    }
  }
`;

const ARTICLE_UPDATE = gql`
  mutation updateArticle($_id: ObjectID!, $article: ArticleInput) {
    updateArticle(_id: $_id, article: $article) {
      ${articleFields.join('\n')}
    }
  }
`;

const ARTICLE_DELETE = gql`
  mutation deleteArticle($_id: ObjectID!) {
    deleteArticle(_id: $_id) {
      ${articleFields.join('\n')}
    }
  }
`;

export default compose(
  graphql(ARTICLE_UPDATE, {
    name: 'updateArticle',
    props({ownProps, updateArticle}) {
      return {
        submit: (article) => updateArticle({
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
    props({deleteArticle}) {
      return {
        delete: (_id) => deleteArticle({
          variables: {
            _id,
          },
        }),
      };
    },
  }),
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
)(ArticleEdit);
