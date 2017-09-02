'use strict';

import { GraphQLNonNull } from 'graphql/type';
import ArticleType, { getArticleProjection } from '../types/article';
import ArticleInputType from '../types/articleInput';
import ObjectIDType from '../types/objectID';
import Article from '~/common/models/article';
import {updateImages} from './fileHelpers';

export const newArticle = {
  type: ArticleType,
  args: {
    article: {
      name: 'article',
      type: ArticleInputType,
    },
  },
  resolve: (root, {article: {cover_file, thumb_file, ...article}}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not Authenticated');
    }

    var result = new Article(article);
    return updateImages(result, cover_file, thumb_file, context).then(() => {
      return result.save(getArticleProjection(fieldASTs));
    });
  },
};

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
  resolve: (root, {_id, article: {cover_file, thumb_file, ...article}}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not Authenticated');
    }

    return Article.findOne({_id}).then(result => {
      Object.assign(result, article);

      return updateImages(result, cover_file, thumb_file, context).then(() => {
        return result.save(getArticleProjection(fieldASTs));
      });
      // var {cover_buffer, thumb_buffer, ...fields} = article;
      // Object.assign(result, fields);

      // const coverImageSaved = (cover_buffer ? SmallFile.create({
      //   data: cover_buffer,
      //   contentType: cover_buffer.mimeType,
      // }) : Promise.resolve(null));

      // const thumbImageSaved = (thumb_buffer ? SmallFile.create({
      //   data: thumb_buffer,
      //   contentType: thumb_buffer.mimeType,
      // }) : Promise.resolve(null));

      // return Promise.all([coverImageSaved, thumbImageSaved]).then(([coverImage, thumbImage]) => {
      //   const coverImageCleared = ((coverImage && result.cover) ?
      //     SmallFile.findByIdAndRemove(result.cover).exec() : Promise.resolve());

      //   const thumbImageCleared = ((thumbImage && result.thumb) ?
      //     SmallFile.findByIdAndRemove(result.thumb).exec() : Promise.resolve());

      //   if (coverImage) {
      //     result.cover = coverImage._id;
      //   }

      //   if (thumbImage) {
      //     result.thumb = thumbImage._id;
      //   }

      //   return Promise.all([coverImageCleared, thumbImageCleared]).then(() => {
      //     return result.save(getArticleProjection(fieldASTs));
      //   });
      // });
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
