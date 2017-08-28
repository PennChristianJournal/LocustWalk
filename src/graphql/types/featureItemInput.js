'use strict';

import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql/type';

export default new GraphQLInputObjectType({
  name: 'FeatureItemInput',
  fields: {
    _typename: {
      type: GraphQLString,
    },
    _id: {
      type: GraphQLID,
    },
  },
});
