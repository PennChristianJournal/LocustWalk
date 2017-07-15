'use strict';

import {
  GraphQLString,
  GraphQLList,
} from 'graphql/type';

import Topic from '~/common/models/topic';
import TopicType from '../types/topic';
import ObjectIDType from '../types/objectID';
import mongoose from 'mongoose';
import {getProjection, skipLimitArgs, applySkipLimit} from '../helpers';

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
    
    let q = Topic.findOne({
      [field]: _id || slug || idOrSlug,
    }, getProjection(fieldASTs));
    
    return q.exec();
  },
};

export const topics = {
  type: new GraphQLList(TopicType),
  args: skipLimitArgs,
  resolve: (root, {skip, limit}, context, fieldASTs) => {
    let q = Topic.find({}, getProjection(fieldASTs));
    
    q.sort({ createdAt: -1 });
    q = applySkipLimit(q, skip, limit);
    return q.exec();
  },
};
