'use strict';

import { GraphQLNonNull } from 'graphql/type';

import ArticleType, { getArticleProjection } from '../types/article';
import ArticleInputType from '../types/articleInput';
import ObjectIDType from '../types/objectID';
import Article from '~/common/models/article';

export const updateArticle = {
  type: ArticleType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(ObjectIDType),
    },
    article: {
      name: 'article',
      type: ArticleInputType,
    },
  },
  resolve: (root, {_id, article}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not Authenticated');
    }
    
    return Article.findOne({_id}).then(result => {
      Object.assign(result, article);
      return result.save(getArticleProjection(fieldASTs));
    });
  },
};

export const deleteArticle = {
  type: ArticleType,
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
    
    return Article.findOneAndRemove({_id}, getArticleProjection(fieldASTs));
  },
};
