'use strict';

import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLNonNull,
} from 'graphql/type';

const FeatureItemTypename = new GraphQLEnumType({
  name: 'FeatureItemTypename',
  values: {
    Article: { value: 'Article' },
    Topic: { value: 'Topic' },
  },
});

export default new GraphQLInputObjectType({
  name: 'FeatureItemInput',
  fields: {
    _typename: {
      type: new GraphQLNonNull(FeatureItemTypename),
    },
    _id: {
      type: GraphQLID,
    },
  },
});
