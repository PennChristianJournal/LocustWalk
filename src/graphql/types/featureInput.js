'use strict';

import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql/type';

import FeatureItemInputType from './featureItemInput';

export default new GraphQLInputObjectType({
  name: 'FeatureInput',
  fields: {
    title: {
      type: GraphQLString,
    },
    is_published: {
      type: GraphQLBoolean,
    },
    mainItem: {
      type: FeatureItemInputType,
    },
    secondaryItems: {
      type: new GraphQLList(FeatureItemInputType),
    },
  },
});
