'use strict';

import { GraphQLNonNull } from 'graphql/type';

import TopicType from '../types/topic';
import TopicInputType from '../types/topicInput';
import ObjectIDType from '../types/objectID';
import Topic from '~/common/models/topic';
import SmallFile from '~/common/models/smallFile';
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
      var {cover_buffer, thumb_buffer, ...fields} = topic;
      Object.assign(result, fields);

      const coverImageSaved = (cover_buffer ? SmallFile.create({
        data: cover_buffer,
        contentType: cover_buffer.mimeType,
      }) : Promise.resolve(null));

      const thumbImageSaved = (thumb_buffer ? SmallFile.create({
        data: thumb_buffer,
        contentType: thumb_buffer.mimeType,
      }) : Promise.resolve(null));

      return Promise.all([coverImageSaved, thumbImageSaved]).then(([coverImage, thumbImage]) => {
        const coverImageCleared = ((coverImage && result.cover) ?
          SmallFile.findByIdAndRemove(result.cover).exec() : Promise.resolve());

        const thumbImageCleared = ((thumbImage && result.thumb) ?
          SmallFile.findByIdAndRemove(result.thumb).exec() : Promise.resolve());

        if (coverImage) {
          result.cover = coverImage._id;
        }

        if (thumbImage) {
          result.thumb = thumbImage._id;
        }

        return Promise.all([coverImageCleared, thumbImageCleared]).then(() => {
          return result.save(getProjection(fieldASTs));
        });
      });

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
