'use strict';

import {
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
    index: {
      type: GraphQLInt,
    },
    mainItem: {
      type: FeatureItemInputType,
    },
    secondaryItems: {
      type: new GraphQLList(FeatureItemInputType),
    },
  },
});
