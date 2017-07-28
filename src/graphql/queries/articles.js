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

import {
  removeEmpty,
  skipLimitArgs,
  applySkipLimit,
  authenticatedField,
} from '../helpers';

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
      is_published: authenticatedField(context, is_published, true),
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
      is_published: authenticatedField(context, is_published, true),
      parent,
    }), getArticleProjection(fieldASTs));

    q.sort({ date: -1 });
    q = applySkipLimit(q, skip, limit);
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
      is_published: authenticatedField(context, is_published, true),
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
      is_published: authenticatedField(context, is_published, true),
      is_featured: true,
    }), getArticleProjection(fieldASTs));

    q.sort({ date: -1 });
    q = applySkipLimit(q, skip, limit);
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
      is_published: authenticatedField(context, is_published, true),
    }), getArticleProjection(fieldASTs));

    q.sort({ date: -1 });
    q = applySkipLimit(q, skip, limit);
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
      is_published: authenticatedField(context, is_published, true),
    })).exec();
  },
};

export const searchArticles = {
  type: new GraphQLList(ArticleType),
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
    let q = Article.find({
      title: {
        $regex: new RegExp(`^${unescape(title).toLowerCase()}`, 'i'),
      },
    }, getArticleProjection(fieldASTs));
    q = applySkipLimit(q, skip, limit);
    return q.exec();
  },
};
