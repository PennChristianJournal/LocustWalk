'use strict';

import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql/type';

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
    cover: {
      type: GraphQLID,
    },
    thumb: {
      type: GraphQLID,
    },
  },
});
