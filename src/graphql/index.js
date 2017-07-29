
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

import bodyParser from 'body-parser';
router.use(bodyParser.json({ limit: 1024 * 1024 * 2000, type: 'application/json' }));
router.use(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' }));

router.use('/', graphqlHTTP({
  schema,
  graphiql: nconf.get('NODE_ENV') === 'development',
}));

export default router;
