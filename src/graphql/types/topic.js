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
import FeatureItemType from '../types/featureItem';
import Article from '~/common/models/article';
import {skipLimitArgs, applySkipLimit, authenticatedField, removeEmpty, htmlPreview} from '../helpers';

// This adds content to the article if preview is requested. Topics mimic that behavior as well
export const getTopicProjection = getArticleProjection;

export default new GraphQLObjectType({
  name: 'Topic',
  interfaces: [FeatureItemType],
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    _typename: {
      type: GraphQLString,
      resolve(root) {
        return root.__typename;
      },
    },
    title: {
      type: GraphQLString,
    },
    is_published: {
      type: GraphQLBoolean,
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
        return htmlPreview(content, length, elipsis);
      },
    },
    slug: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
      resolve: ({slug}) => {
        return `/themes/${slug}`;
      },
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
  }),
});
