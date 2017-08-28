'use strict';

import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql/type';
import GraphQLBuffer from './buffer';

import { GraphQLDateTime } from 'graphql-iso-date';

export default new GraphQLInputObjectType({
  name: 'ArticleInput',
  fields: {
    title: {
      type: GraphQLString,
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
    slug: {
      type: GraphQLString,
    },
    cover_buffer: {
      type: GraphQLBuffer,
    },
    thumb_buffer: {
      type: GraphQLBuffer,
    },
    parent: {
      type: GraphQLID,
    },
    topic: {
      type: GraphQLID,
    },
  },
});
