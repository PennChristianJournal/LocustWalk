'use strict';

import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql/type';

import { GraphQLDateTime } from 'graphql-iso-date';

export default new GraphQLInputObjectType({
  name: 'ArticleInput',
  fields: {
    title: {
      type: GraphQLString,
    },
    is_featured: {
      type: GraphQLBoolean,
    },
    is_published: {
      type: GraphQLBoolean,
    },
    date: {
      type: GraphQLDateTime,
    },
    author: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    heading_override: {
      type: GraphQLString,
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
    parent: {
      type: GraphQLID,
    },
    topic: {
      type: GraphQLID,
    },
  },
});
