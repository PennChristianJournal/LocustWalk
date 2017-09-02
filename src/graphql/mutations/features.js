'use strict';

import { GraphQLNonNull } from 'graphql/type';
import FeatureType from '../types/feature';
import FeatureInputType from '../types/featureInput';
import ObjectIDType from '../types/objectID';
import Feature from '~/common/models/feature';
import {getProjection} from '../helpers';

export const newFeature = {
  type: FeatureType,
  args: {
    feature: {
      name: 'feature',
      type: FeatureInputType,
    },
  },
  resolve: (root, {feature}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not Authenticated');
    }

    var obj = Object.assign(new Feature(), feature);

    return obj.save(getProjection(fieldASTs));
  },
};

export const updateFeature = {
  type: FeatureType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(ObjectIDType),
    },
    feature: {
      name: 'feature',
      type: FeatureInputType,
    },
  },
  resolve: (root, {_id, feature}, context, fieldASTs) => {
    if (!context.isAuthenticated()) {
      return Promise.reject('Not Authenticated');
    }

    return Feature.findOne({_id}).then(result => {
      Object.assign(result, feature);
      return result.save(getProjection(fieldASTs));
    });
  },
};

export const deleteFeature = {
  type: FeatureType,
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

    return Feature.findOneAndRemove({_id}, getProjection(fieldASTs));
  },
};
