'use strict';

import {Component} from 'react';
import PropTypes from 'prop-types';
import {compose, graphql} from 'react-apollo';
import {editingContext} from './editing-context';
import {FEATURE_QUERY} from '../gql/queries';
import {FEATURE_NEW, FEATURE_UPDATE, FEATURE_DELETE} from '../gql/mutations';

const editableFeatureFields = {
  title: true,
  index: true,
  is_published: true,
  mainItem: {
    _id: true,
    _typename: true,
  },
  secondaryItems: {
    _id: true,
    _typename: true,
  },
};

class FeatureEdit extends Component {
  render() {
    return !this.props.children ? null : this.props.children(this.props);
  }
}

FeatureEdit.propTypes = {
  children: PropTypes.func,
};

export default compose(
  graphql(FEATURE_QUERY, {
    skip(props) {
      return !props._id;
    },
    options(props) {
      return {
        variables: {
          _id: props._id,
        },
      };
    },
    props({ data: { loading, feature }}) {
      return {
        feature,
        loading,
      };
    },
  }),
  graphql(FEATURE_NEW, {
    name: 'newFeature',
    props({newFeature}) {
      return {
        newFeature: (feature) => newFeature({
          variables: {
            feature,
          },
        }),
      };
    },
  }),
  graphql(FEATURE_UPDATE, {
    skip(props) {
      return !props._id;
    },
    name: 'updateFeature',
    props({ownProps, updateFeature}) {
      return {
        updateFeature: (feature) => updateFeature({
          variables: {
            _id: ownProps._id,
            feature,
          },
        }),
      };
    },
  }),
  graphql(FEATURE_DELETE, {
    skip(props) {
      return !props._id;
    },
    name: 'deleteFeature',
    props({ownProps, deleteFeature}) {
      return {
        deleteFeature: () => deleteFeature({
          variables: {
            _id: ownProps._id,
          },
        }),
      };
    },
  }),
  editingContext({
    createStage({feature = {}}, stage = {}) {
      if (!feature._id) {
        return {};
      } else if (feature._id != stage._id) {
        return Object.assign({}, feature);
      } else {
        return Object.assign({}, feature, stage);
      }
    },
    props(ownProps, stage) {
      return {
        submit() {
          const isNew = !stage.values._id;

          function project(tgt, src, fields) {
            return fields.filter(key => tgt.hasOwnProperty(key))
            .reduce((obj, key) => {
              if (typeof src[key] === 'object') {
                if (Array.isArray(src[key])) {
                  obj[key] = src[key].map(el => project(tgt[key], el, Object.keys(el)));
                } else {
                  obj[key] = project(tgt[key], src[key], Object.keys(src[key]));
                }
              } else {
                obj[key] = src[key];
              }
              return obj;
            }, {});
          }

          const params = project(editableFeatureFields, stage.values,
            (isNew ? Object.keys(stage.values) : stage.getChangedFields()));

          if (isNew) {
            return ownProps.newFeature(params);
          } else {
            return ownProps.updateFeature(params);
          }
        },
        cancel(cb) {
          stage.clear(cb);
        },
        delete() {
          return ownProps.deleteFeature();
        },
      };
    },
  }),
)(FeatureEdit);

