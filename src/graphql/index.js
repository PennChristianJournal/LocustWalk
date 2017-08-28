
import { Router } from 'express';
const router = new Router();
import nconf from 'nconf';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType } from 'graphql/type';

import * as articleQueries from './queries/articles';
import * as topicQueries from './queries/topics';
import * as featureQueries from './queries/features';

import * as articleMutations from './mutations/articles';
import * as topicMutations from './mutations/topics';
import * as featureMutations from './mutations/features';

import ArticleType from './types/article';
import TopicType from './types/topic';

export const schema = new GraphQLSchema({
  types: [ArticleType, TopicType],
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      ...articleQueries,
      ...topicQueries,
      ...featureQueries,
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      ...articleMutations,
      ...topicMutations,
      ...featureMutations,
    },
  }),
});

router.use('/', graphqlHTTP({
  schema,
  graphiql: nconf.get('NODE_ENV') === 'development',
}));

export default router;
