'use strict';

import { GraphQLNonNull } from 'graphql/type';

import TopicType from '../types/topic';
import TopicInputType from '../types/topicInput';
import ObjectIDType from '../types/objectID';
import Topic from '~/common/models/topic';
import {getProjection} from '../helpers';

export const newTopic = {
  type: TopicType,
  args: {
    topic: {
      name: 'topic',
      type: TopicInputType,
    },
  },
  resolve: (root, {topic}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not Authenticated');
    }

    return (new Topic(topic)).save(getProjection(fieldASTs));
  },
};

export const updateTopic = {
  type: TopicType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(ObjectIDType),
    },
    topic: {
      name: 'topic',
      type: TopicInputType,
    },
  },
  resolve: (root, {_id, topic}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not Authenticated');
    }

    return Topic.findOne({_id}).then(result => {
      Object.assign(result, topic);
      return result.save(getProjection(fieldASTs));
    });
  },
};

export const deleteTopic = {
  type: TopicType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(ObjectIDType),
    },
  },
  resolve: (root, {_id}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not Authenticated');
    }

    return Topic.findOneAndRemove({_id}, getProjection(fieldASTs));
  },
};
