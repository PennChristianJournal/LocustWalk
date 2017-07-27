'use strict';

import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql/type';

import Article from '~/common/models/article';
import Topic from '~/common/models/topic';
import { GraphQLDateTime } from 'graphql-iso-date';
import TopicType from './topic';
import {getProjection, htmlPreview} from '../helpers';

export function getArticleProjection(fieldASTs) {
  let projection = getProjection(fieldASTs);
  // preview is a computed field so we still need to query the content if only the preview is requested
  if (projection.preview) {
    projection.content = true;
  }
  return projection;
}

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    is_featured: {
      type: GraphQLBoolean,
    },
    is_published: {
      type: GraphQLBoolean,
    },
    date: {
      type: GraphQLDateTime,
    },
    author: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    preview: {
      type: GraphQLString,
      args: {
        length: {
          name: 'length',
          type: GraphQLInt,
          defaultValue: 140,
        },
        elipsis: {
          name: 'elipsis',
          type: GraphQLBoolean,
          defaultValue: true,
        },
      },
      resolve: ({content}, {length, elipsis}) => {
        return htmlPreview(content, length, elipsis);
      },
    },
    heading_override: {
      type: GraphQLString,
    },
    slug: {
      type: GraphQLString,
    },
    cover: {
      type: GraphQLID,
    },
    thumb: {
      type: GraphQLID,
    },
    parentID: {
      type: GraphQLID,
    },
    parent: {
      type: ArticleType,
      resolve: (root, args, context, fieldASTs) => {
        return Article.findOne({_id: root._id}, {parent: true}).then(({parent}) => {
          if (!parent) {
            return Promise.resolve(null);
          }
          return Article.findOne({_id: parent}, getArticleProjection(fieldASTs));
        });
      },
    },
    topicID: {
      type: GraphQLID,
      resolve: (root, args, context, fieldASTs) => {
        return Article.findOne({_id: root._id}, {topic: true}).then(({topic}) => {
          return Promise.resolve(topic);
        });
      },
    },
    topic: {
      type: TopicType,
      resolve: (root, args, context, fieldASTs) => {
        return Article.findOne({_id: root._id}, {topic: true}).then(({topic}) => {
          if (!topic) {
            return Promise.resolve(null);
          }
          return Topic.findOne({_id: topic}, getProjection(fieldASTs));
        });
      },
    },
  }),
});

export default ArticleType;
