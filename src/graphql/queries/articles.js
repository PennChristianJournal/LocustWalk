'use strict';

import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql/type';

import ArticleType, { getArticleProjection } from '../types/article';
import ObjectIDType from '../types/objectID';
import Article from '~/common/models/article';
import mongoose from 'mongoose';

function removeEmpty(obj) {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
}

const skipLimitArgs = {
  skip: {
    name: 'skip',
    type: GraphQLInt,
    defaultValue: 0,
  },
  limit: {
    name: 'limit',
    type: GraphQLInt,
    defaultValue: 10,
  },
};

export const article = {
  type: ArticleType,
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
    is_published: {
      name: 'is_published',
      type: GraphQLBoolean,
    },
  },
  resolve: (root, {idOrSlug, is_published, _id, slug}, context, fieldASTs) => {
    if (!(idOrSlug || _id || slug)) {
      return Promise.reject('No id or slug provided');
    }
    
    let field = (_id || mongoose.Types.ObjectId.isValid(idOrSlug)) ? '_id' : 'slug';
    
    let q = Article.findOne(removeEmpty({
      is_published: !context.isAuthenticated() ? true : is_published,
      [field]: _id || slug || idOrSlug,
    }), getArticleProjection(fieldASTs));
    
    return q.exec();
  },
};

export const articleResponses = {
  type: new GraphQLList(ArticleType),
  args: Object.assign({
    parent: {
      name: 'parent',
      type: ObjectIDType,
    },
    is_published: {
      name: 'is_published',
      type: GraphQLBoolean,
    },
  }, skipLimitArgs),
  resolve: (root, {parent, is_published, skip, limit}, context, fieldASTs) => {
    if (!parent) {
      return Promise.resolve([]);
    }
    
    let q = Article.find(removeEmpty({
      is_published: !context.isAuthenticated() ? true : is_published,
      parent,
    }), getArticleProjection(fieldASTs));
    
    q.sort({ date: -1 });
    
    if (skip) {
      q = q.skip(skip);
    }
    if (limit) {
      q = q.limit(limit);
    }
    
    return q.exec();
  },
};

export const articleResponsesCount = {
  type: GraphQLInt,
  args: Object.assign({
    parent: {
      name: 'parent',
      type: ObjectIDType,
    },
    is_published: {
      name: 'is_published',
      type: GraphQLBoolean,
    },
  }),
  resolve: (root, {parent, is_published}, context, fieldASTs) => {
    if (!parent) {
      return Promise.resolve(0);
    }
    
    let q = Article.count(removeEmpty({
      is_published: !context.isAuthenticated() ? true : is_published,
      parent,
    }), getArticleProjection(fieldASTs));
    
    return q.exec();
  },
};

export const featuredArticles = {
  type: new GraphQLList(ArticleType),
  args: Object.assign({
    is_published: {
      name: 'is_published',
      type: GraphQLBoolean,
    },
  }, skipLimitArgs),
  resolve: (root, {is_published, skip, limit}, context, fieldASTs) => {
    let q = Article.find(removeEmpty({
      is_published: !context.isAuthenticated() ? true : is_published,
      is_featured: true,
    }), getArticleProjection(fieldASTs));
    
    q.sort({ date: -1 });
    
    if (skip) {
      q = q.skip(skip);
    }
    if (limit) {
      q = q.limit(limit);
    }
    
    return q.exec();
  },
};

export const recentArticles = {
  type: new GraphQLList(ArticleType),
  args: Object.assign({
    is_published: {
      name: 'is_published',
      type: GraphQLBoolean,
    },
  }, skipLimitArgs),
  resolve: (root, {is_published, skip, limit}, context, fieldASTs) => {
    let q = Article.find(removeEmpty({
      is_published: !context.isAuthenticated() ? true : is_published,
    }), getArticleProjection(fieldASTs));
    
    q.sort({ date: -1 });
    
    if (skip) {
      q = q.skip(skip);
    }
    if (limit) {
      q = q.limit(limit);
    }
    
    return q.exec();
  },
};

export const articleCount = {
  type: new GraphQLNonNull(GraphQLInt),
  args: {
    is_published: {
      name: 'is_published',
      type: GraphQLBoolean,
    },
  },
  resolve(root, {is_published}, context) {
    return Article.count(removeEmpty({
      is_published: !context.isAuthenticated() ? true : is_published,
    })).exec();
  },
};
