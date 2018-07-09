'use strict';

import { GraphQLNonNull } from 'graphql/type';

import ArticleType, { getArticleProjection } from '../types/article';
import ArticleInputType from '../types/articleInput';
import ObjectIDType from '../types/objectID';
import Article from '~/models/article';
import SmallFile from '~/models/smallFile';
import { removeEmpty } from '../helpers';

export const newArticle = {
  type: ArticleType,
  args: {
    article: {
      name: 'article',
      type: ArticleInputType,
    },
  },
  resolve: (root, {article}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not Authenticated');
    }

    let {cover_buffer, thumb_buffer, parent, topic, ...fields} = article;
    fields.parent = parent && parent._id;
    fields.topic = topic && topic._id;

    const coverImageSaved = (cover_buffer ? SmallFile.create({
      data: cover_buffer,
      contentType: cover_buffer.mimeType,
    }) : Promise.resolve(null));

    const thumbImageSaved = (thumb_buffer ? SmallFile.create({
      data: thumb_buffer,
      contentType: thumb_buffer.mimeType,
    }) : Promise.resolve(null));

    return Promise.all([coverImageSaved, thumbImageSaved]).then(([coverImage, thumbImage]) => {
      if (coverImage) {
        fields.cover = coverImage._id;
      }
      if (thumbImage) {
        fields.thumb = thumbImage._id;
      }

      return (new Article(fields)).save(getArticleProjection(fieldASTs));
    });
  }
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
  resolve: (root, {_id, article}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not Authenticated');
    }

    return Article.findOne({_id}).then(result => {
      var {cover_buffer, thumb_buffer, parent, topic, ...fields} = article;

      Object.assign(result, fields, removeEmpty({
        parent: parent && parent._id,
        topic: topic && topic._id,
      }));

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
          return result.save(getArticleProjection(fieldASTs));
        });
      });
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
