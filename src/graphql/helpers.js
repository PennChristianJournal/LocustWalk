'use strict';

import {
  GraphQLInt,
} from 'graphql/type';


export function removeEmpty(obj) {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
}

export function getProjection(fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

export const skipLimitArgs = {
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

export function applySkipLimit(query, skip, limit) {
  if (skip) {
    query = query.skip(skip);
  }
  if (limit) {
    query = query.limit(limit);
  }

  return query;
}

export function authenticatedField(context, value, defaultValue) {
  return context.isAuthenticated() ? value : defaultValue;
}

export function trim(content, length, elipsis) {
  if (!content) {
    return content;
  }

  if (elipsis) {
    length -= 3;
  }
  length = Math.max(0, length);

  if (content.length > length) {
    content = content.substring(0, length);
    if (elipsis) {
      content += '...';
    }
  }
  return content;
}

export function htmlPreview(content, length, elipsis) {
  if (!content) {
    return content;
  }

  content = content
    .replace(/<sup><a\b[^>]*>\[\d+\]<\/a><\/sup>/ig, '')
    .replace(/(<([^>]+)>)/ig, '')
    .replace(/&nbsp;/ig, ' ');

  return trim(content, length, elipsis);
}
