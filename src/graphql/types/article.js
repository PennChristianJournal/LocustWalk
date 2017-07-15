'use strict';

import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql/type';

import { GraphQLDateTime } from 'graphql-iso-date';

import {getProjection, htmlPreview} from '../helpers';

export function getArticleProjection(fieldASTs) {
  let projection = getProjection(fieldASTs);
  // preview is a computed field so we still need to query the content if only the preview is requested
  if (projection.preview) {
    projection.content = true;
  }
  return projection;
}

export default new GraphQLObjectType({
  name: 'Article',
  fields: {
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
    parent: {
      type: GraphQLID,
    },
  },
});
