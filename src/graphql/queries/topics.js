'use strict';

import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql/type';

import Topic from '~/models/topic';
import TopicType, { getTopicProjection } from '../types/topic';
import ObjectIDType from '../types/objectID';
import mongoose from 'mongoose';

import {
  removeEmpty,
  skipLimitArgs,
  applySkipLimit,
  authenticatedField,
} from '../helpers';

export const topic = {
  type: TopicType,
  args: {
    _id: {
      name: '_id',
      type: ObjectIDType,
    },
    slug: {
      name: 'slug',
      type: GraphQLString,
    },
    idOrSlug: {
      name: 'idOrSlug',
      type: GraphQLString,
    },
  },
  resolve: (root, {idOrSlug, is_published, _id, slug}, context, fieldASTs) => {
    if (!(idOrSlug || _id || slug)) {
      return Promise.reject('No id or slug provided');
    }

    let field = (_id || mongoose.Types.ObjectId.isValid(idOrSlug)) ? '_id' : 'slug';

    let q = Topic.findOne(removeEmpty({
      [field]: _id || slug || idOrSlug,
    }), getTopicProjection(fieldASTs));

    return q.exec();
  },
};

export const topics = {
  type: new GraphQLList(TopicType),
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
  resolve: (root, {is_published, skip, limit, search}, context, fieldASTs) => {
    let q = Topic.find(removeEmpty({
      is_published: authenticatedField(context, is_published, true),
      title: search.length > 0 ? { $regex: new RegExp(search, 'i') } : undefined,
    }), getTopicProjection(fieldASTs));

    q.sort({ createdAt: -1 });
    q = applySkipLimit(q, skip, limit);
    return q.exec();
  },
};

export const topicCount = {
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
    return Topic.count(removeEmpty({
      is_published: authenticatedField(context, is_published, true),
      title: search.length > 0 ? { $regex: new RegExp(search, 'i') } : undefined,
    })).exec();
  },
};

export const searchTopics = {
  type: new GraphQLList(TopicType),
  args: Object.assign({
    title: {
      name: 'title',
      type: new GraphQLNonNull(GraphQLString),
    },
  }, skipLimitArgs),
  resolve: (root, {title, skip, limit}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not authenticated');
    }
    let q = Topic.find({
      title: {
        $regex: new RegExp(`^${unescape(title).toLowerCase()}`, 'i'),
      },
    }, getTopicProjection(fieldASTs));
    q = applySkipLimit(q, skip, limit);
    return q.exec();
  },
};
