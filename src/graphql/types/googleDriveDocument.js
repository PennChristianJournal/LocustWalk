'use strict';

import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';

export default new GraphQLObjectType({
  name: 'GoogleDriveDocument',
  fields: {
    name: {
      type: GraphQLString,
    },
    id: {
      type: GraphQLID,
    },
  },
});
