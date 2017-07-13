
import { Router } from 'express';
const router = new Router();
import nconf from 'nconf';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType } from 'graphql/type';

import * as articleQueries from './queries/articles';
import * as articleMutations from './mutations/articles';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      ...articleQueries,
    },
  }),
  
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      ...articleMutations,
    },
  }),
});

router.use('/', graphqlHTTP({
  schema, 
  graphiql: nconf.get('NODE_ENV') === 'development',
}));

export function getProjection(fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

export default router;
