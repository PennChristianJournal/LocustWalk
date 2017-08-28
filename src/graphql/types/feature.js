'use strict';

import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql/type';

import {getProjection} from '../helpers';
import Article from '~/common/models/article';
import Topic from '~/common/models/topic';
import {projectionForArticle} from './article';
import FeatureItemType from './featureItem';

function getFeatureItem(item, fieldASTs) {
  if (item._typename === 'Article') {
    return Article.findById(item._id, projectionForArticle(getProjection(fieldASTs, 'Article')));
  } else if (item._typename === 'Topic') {
    return Topic.findById(item._id, projectionForArticle(getProjection(fieldASTs, 'Topic')));
  } else {
    return Promise.reject(`Invalid feature item type ${item._typename}`);
  }
}

export default new GraphQLObjectType({
  name: 'Feature',
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    index: {
      type: GraphQLInt,
    },
    mainItem: {
      type: new GraphQLNonNull(FeatureItemType),
      resolve: ({mainItem}, args, context, fieldASTs) => {
        return getFeatureItem(mainItem, fieldASTs);
      },
    },
    secondaryItems: {
      type: new GraphQLList(FeatureItemType),
      resolve: ({secondaryItems}, args, context, fieldASTs) => {
        return secondaryItems.map(item => {
          return getFeatureItem(item, fieldASTs);
        });
      },
    },
  }),
});

