'use strict';

import {
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInterfaceType,
} from 'graphql/type';

import Article from '~/common/models/article';
import Topic from '~/common/models/topic';
import ArticleType from './article';
import TopicType from './topic';

export default new GraphQLInterfaceType({
  name: 'FeatureItem',
  resolveType: (data) => {
    if (data instanceof Article) {
      return ArticleType;
    } else if (data instanceof Topic) {
      return TopicType;
    }
  },
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    _typename: {
      type: GraphQLString,
    },
    title: {
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
      resolve: (root, args) => {
        return root.preview(args);
      },
    },
    slug: {
      type: GraphQLString,
    },
    thumb: {
      type: GraphQLID,
    },
    url: {
      type: GraphQLString,
    },
  }),
});