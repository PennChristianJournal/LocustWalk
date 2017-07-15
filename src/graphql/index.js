
import { Router } from 'express';
const router = new Router();
import nconf from 'nconf';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType } from 'graphql/type';

import * as articleQueries from './queries/articles';
import * as topicQueries from './queries/topics';

import * as articleMutations from './mutations/articles';
import * as topicMutations from './mutations/topics';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      ...articleQueries,
      ...topicQueries,
    },
  }),
  
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      ...articleMutations,
      ...topicMutations,
    },
  }),
});

router.use('/', graphqlHTTP({
  schema, 
  graphiql: nconf.get('NODE_ENV') === 'development',
}));

export default router;
