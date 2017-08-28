'use strict';

import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} from 'graphql/type';

import {
  skipLimitArgs,
  applySkipLimit,
  getProjection,
} from '../helpers';

import ObjectIDType from '../types/objectID';
import FeatureType from '../types/feature';
import FeatureItemType from '../types/featureItem';
import {projectionForArticle} from '../types/article';
import Feature from '~/common/models/feature';
import Article from '~/common/models/article';
import Topic from '~/common/models/topic';

export const feature = {
  type: FeatureType,
  args: {
    _id: {
      name: '_id',
      type: ObjectIDType,
    },
  },
  resolve: (root, {_id}, context, fieldASTs) => {
    return Feature.findById(_id);
  },
};

export const features = {
  type: new GraphQLList(FeatureType),
  args: skipLimitArgs,
  resolve: (root, {skip, limit}, context, fieldASTs) => {
    let q = Feature.find({});
    q.sort({ index: 1 });
    q = applySkipLimit(q, skip, limit);
    return q.exec();
  },
};

export const featureCount = {
  type: new GraphQLNonNull(GraphQLInt),
  resolve: () => {
    return Feature.count({}).exec();
  },
};

export const searchFeatureItems = {
  type: new GraphQLList(FeatureItemType),
  args: {
    title: {
      name: 'title',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (root, {title, skip, limit}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not authenticated');
    }

    var getArticles = Article.find({
      title: {
        $regex: new RegExp(`^${unescape(title).toLowerCase()}`, 'i'),
      },
    }, projectionForArticle(getProjection(fieldASTs, 'Article')));

    var getTopics = Topic.find({
      title: {
        $regex: new RegExp(`^${unescape(title).toLowerCase()}`, 'i'),
      },
    }, projectionForArticle(getProjection(fieldASTs, 'Topic')));

    return Promise.all([getArticles, getTopics]).then(results => {
      return results.reduce((a, b) => a.concat(b), []);
    });
  },
};
