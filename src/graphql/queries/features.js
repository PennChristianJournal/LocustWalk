'use strict';

import {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} from 'graphql/type';

import {
  skipLimitArgs,
  applySkipLimit,
  getProjection,
  removeEmpty,
  authenticatedField,
} from '../helpers';

import ObjectIDType from '../types/objectID';
import FeatureType from '../types/feature';
import FeatureItemType from '../types/featureItem';
import {projectionForArticle} from '../types/article';
import Feature from '~/models/feature';
import Article from '~/models/article';
import Topic from '~/models/topic';

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
  args: Object.assign({
    is_published: {
      name: 'is_published',
      type: GraphQLBoolean,
    },
    search: {
      name: 'search',
      type: GraphQLString,
      defaultValue: '',
    },
  }, skipLimitArgs),
  resolve: (root, {skip, limit, is_published, search}, context, fieldASTs) => {
    let q = Feature.find(removeEmpty({
      is_published: authenticatedField(context, is_published, true),
      title: search.length > 0 ? { $regex: new RegExp(search, 'i') } : undefined,
    }));
    q.sort({ index: -1 });
    q = applySkipLimit(q, skip, limit);
    return q.exec();
  },
};

export const featureCount = {
  type: new GraphQLNonNull(GraphQLInt),
  args: {
    is_published: {
      name: 'is_published',
      type: GraphQLBoolean,
    },
    search: {
      name: 'search',
      type: GraphQLString,
      defaultValue: '',
    },
  },
  resolve: (root, {is_published, search}, context) => {
    return Feature.count(removeEmpty({
      is_published: authenticatedField(context, is_published, true),
      title: search.length > 0 ? { $regex: new RegExp(search, 'i') } : undefined,
    })).exec();
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
