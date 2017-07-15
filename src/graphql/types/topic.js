'use strict';

import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql/type';

import ArticleType, {getArticleProjection} from './article';
import Article from '~/common/models/article';
import {skipLimitArgs, applySkipLimit, authenticatedField, removeEmpty, htmlPreview} from '../helpers';

export default new GraphQLObjectType({
  name: 'Topic',
  fields: {
    _id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    preview: {
      type: GraphQLString,
      args: {
        length: {
          name: 'length',
          type: GraphQLInt,
          defaultValue: 140,
        },
        elipsis: {
          name: 'elipsis',
          type: GraphQLBoolean,
          defaultValue: true,
        },
      },
      resolve: ({content}, {length, elipsis}) => {
        htmlPreview(content, length, elipsis);
      },
    },
    slug: {
      type: GraphQLString,
    },
    cover: {
      type: GraphQLID,
    },
    thumb: {
      type: GraphQLID,
    },
    articles: {
      type: new GraphQLList(ArticleType),
      args: Object.assign({
        is_published: {
          name: 'is_published',
          type: GraphQLBoolean,
        },
      }, skipLimitArgs),
      resolve(root, {is_published, skip, limit}, context, fieldASTs) {
        let q = Article.find(removeEmpty({
          topic: root._id,
          is_published: authenticatedField(context, is_published, true),
        }), getArticleProjection(fieldASTs));

        q.sort({date: -1});
        q = applySkipLimit(q, skip, limit);
        return q.exec();
      },
    },
  },
});

