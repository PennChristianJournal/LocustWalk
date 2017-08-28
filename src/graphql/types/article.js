'use strict';

import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql/type';

import Article from '~/common/models/article';
import Topic from '~/common/models/topic';
import { GraphQLDateTime } from 'graphql-iso-date';
import TopicType from './topic';
import FeatureItemType from '../types/featureItem';
import {getProjection, htmlPreview} from '../helpers';

export function projectionForArticle(projection) {
  // preview is a computed field so we still need to query the content if only the preview is requested
  if (projection.preview) {
    projection.content = true;
  }
  if (projection.url) {
    projection.slug = true;
  }
  return projection;
}

export function getArticleProjection(fieldASTs) {
  return projectionForArticle(getProjection(fieldASTs));
}

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  interfaces: [FeatureItemType],
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    _typename: {
      type: GraphQLString,
      resolve(root) {
        return root.__typename;
      },
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
    heading_override: {
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
    slug: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
      resolve: ({slug}) => {
        return `/articles/${slug}`;
      },
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
