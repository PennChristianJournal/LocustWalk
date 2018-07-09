'use strict';
import Promise from 'bluebird';
import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql/type';

import Article from '~/models/article';
import Topic from '~/models/topic';
import { GraphQLDateTime } from 'graphql-iso-date';
import TopicType from './topic';
import FeatureItemType from '../types/featureItem';
import {getProjection, htmlPreview, skipLimitArgs, removeEmpty, authenticatedField, applySkipLimit} from '../helpers';

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
  return projectionForArticle(getProjection(fieldASTs, "Article"));
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
    responses: {
      type: new GraphQLList(ArticleType),
      args: Object.assign({
        is_published: {
          name: 'is_published',
          type: GraphQLBoolean,
        },
      }, skipLimitArgs),
      resolve(root, {is_published, skip, limit}, context, fieldASTs) {
        let q = Article.find(removeEmpty({
          parent: root._id,
          is_published: authenticatedField(context, is_published, true),
        }), getArticleProjection(fieldASTs));

        q.sort({date: -1});
        q = applySkipLimit(q, skip, limit);
        return q.exec();
      },
    },
  }),
});

export default ArticleType;
