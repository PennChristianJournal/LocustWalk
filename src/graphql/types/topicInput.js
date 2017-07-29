'use strict';

import {
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql/type';
import GraphQLBuffer from './buffer';

export default new GraphQLInputObjectType({
  name: 'TopicInput',
  fields: {
    title: {
      type: GraphQLString,
    },
    slug: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    cover_buffer: {
      type: GraphQLBuffer,
    },
    thumb_buffer: {
      type: GraphQLBuffer,
    },
  },
});
