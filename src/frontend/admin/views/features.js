import React, {Component, Fragment} from 'react';
import { Helmet } from 'react-helmet';
import Switch from 'react-router/Switch';
import Route from 'react-router/Route';
import {Link, withRouter} from 'react-router-dom';
import pluralize from 'pluralize';
import {compose, graphql} from 'react-apollo';
import gql from 'graphql-tag';
import classnames from 'classnames';
import {defaultValue} from '../../common/helpers';
import {getFileURL} from '../../common/helpers/file';
import Modal from '../components/modal';
import ModelPage from '../components/model-page';
import BooleanField from '../components/form/boolean-field';
import TextField from '../components/form/text-field';
import TypeaheadField from '../components/form/typeahead-field';
import EditPanel from '../components/edit-panel';
import AdminCard from '../components/admin-card';
import {FEATURES_LOAD_QUERY, FEATURE_QUERY} from '../gql/queries';
import {FEATURE_NEW, FEATURE_UPDATE, FEATURE_DELETE} from '../gql/mutations';
import {ArticleDisplay} from './articles';
import {TopicDisplay} from './topics';

export const FeatureDisplay = withRouter(({location, document, className}) => (
  <AdminCard
      className={className}
      title={document.title}
      disabled={!document.is_published}
      subcards={[document.mainItem, ...(document.secondaryItems || [])].map((item, i) => {
        if (!item) {
          return null;
        }

        switch(item.__typename) {
          case 'Topic':
            return <TopicDisplay document={item} key={`${item._id}_${i}`} className="admin-subcard"/>
          case 'Article':
            return <ArticleDisplay document={item} key={`${item._id}_${i}`} className="admin-subcard"/>
        }
      })}
  >
    <p className="card-text">
      <Link to={`/admin/features/${document._id}/edit${location.search}`} className="btn btn-outline-primary">Edit</Link>
    </p>
  </AdminCard>
));

export const FeatureEdit = compose(
  graphql(FEATURE_QUERY, {
    withRef: true,
    skip({isNew}) {
      return isNew;
    },
    options({id}) {
      return {
        variables: {
          _id: id,
        }
      };
    },
    props({data: { loading, feature }}) {
      return {
        feature
      };
    }
  }),
  graphql(FEATURE_NEW, {
    withRef: true,
    skip({isNew}) {
      return !isNew;
    },
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
    withRef: true,
    skip({isNew}) {
      return isNew;
    },
    name: 'updateFeature',
    props({ownProps, updateFeature}) {
      return {
        updateFeature: (feature) => updateFeature({
          variables: {
            _id: ownProps.id,
            feature,
          },
        }),
      };
    },
  }),
  graphql(FEATURE_DELETE, {
    withRef: true,
    skip({isNew}) {
      return isNew;
    },
    name: 'deleteFeature',
    props({ownProps, deleteFeature}) {
      return {
        deleteFeature: () => deleteFeature({
          variables: {
            _id: ownProps.id,
          },
        }),
      };
    },
  }),
)(class FeaturePanel extends EditPanel {
  constructor(props) {
    super(props);
    this.editableFields = [
      'title',
      'is_published',
      'mainItem',
      'secondaryItems',
    ];
  }

  submit() {
    if (this.props.isNew) {
      return this.props.newFeature(this.getChanges());
    } else {
      return this.props.updateFeature(this.getChanges());
    }
  }

  delete() {
    return this.props.deleteFeature();
  }

  render() {
    const feature = (!this.props.isNew && this.props.feature) || {
      is_published: false,
      title: '',
    };

    if (!feature) {
      return null;
    }

    const mainItem = defaultValue(this.state._mainItem, feature.mainItem) || {};
    let secondaryItems = (this.state._secondaryItems || feature.secondaryItems || []).slice();
    secondaryItems.push({});

    return (
      <Fragment key={feature._id}>
        <BooleanField
          label="Published"
          name="is_published"
          checked={defaultValue(this.state.is_published, feature.is_published)}
          onChange={this._handleChange}
        />

        <TextField
          label="Title"
          name="title"
          value={defaultValue(this.state.title, feature.title)}
          onChange={this._handleChange}
        />

        <TypeaheadField
          label="Main Item"
          placeholder="Main Item"
          type="text"
          className="form-control"
          defaultValue={defaultValue(mainItem.title, '')}
          typeaheadConfig={{
            hint: true,
            highlight: true,
            minLength: 1,
            display: 'title',
          }}

          createBloodhoundConfig={function(Bloodhound, $) {
            return new Bloodhound({
              datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
              queryTokenizer: Bloodhound.tokenizers.whitespace,
              remote: {
                url: '%QUERY',
                wildcard: '%QUERY',
                transport(options, onSuccess, onError) {
                  let data = {
                    operationName: 'FeaturesSearch',
                    query: `
                      query FeaturesSearch($title: String!) {
                        searchFeatureItems(title: $title) {
                          _id
                          title
                          __typename
                        }
                      }
                    `,
                    variables: {
                      title: options.url,
                    },
                  };
                  $.ajax({
                    type: 'POST',
                    url: '/graphql',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                  })
                  .done(({data: { searchFeatureItems } }) => {onSuccess(searchFeatureItems); })
                  .fail((request, status, error) => {onError(error); });
                },
              },
            });
          }}

          onChange={(mainItem) => {
            this.setState({
              _mainItem: mainItem,
              mainItem: {
                _id: mainItem._id,
                _typename: mainItem.__typename,
              },
            });
          }}
        >
          <input type="text" readOnly className="form-control" placeholder="Main Item ID"
            value={defaultValue(mainItem._id && `${mainItem.__typename} ${mainItem._id}`, ''
          )} />
        </TypeaheadField>

        {secondaryItems.map((item, i) => (
          <TypeaheadField
            key={`${item._id}_${i}`}
            label={`Secondary Item ${i + 1}`}
            placeholder={`Secondary Item ${i + 1}`}
            type="text"
            className="form-control"
            defaultValue={defaultValue(item.title, '')}
            typeaheadConfig={{
              hint: true,
              highlight: true,
              minLength: 1,
              display: 'title',
            }}

            createBloodhoundConfig={function(Bloodhound, $) {
              return new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                  url: '%QUERY',
                  wildcard: '%QUERY',
                  transport(options, onSuccess, onError) {
                    let data = {
                      operationName: 'FeaturesSearch',
                      query: `
                        query FeaturesSearch($title: String!) {
                          searchFeatureItems(title: $title) {
                            _id
                            title
                            __typename
                          }
                        }
                      `,
                      variables: {
                        title: options.url,
                      },
                    };
                    $.ajax({
                      type: 'POST',
                      url: '/graphql',
                      contentType: 'application/json',
                      data: JSON.stringify(data),
                    })
                    .done(({data: { searchFeatureItems } }) => {onSuccess(searchFeatureItems); })
                    .fail((request, status, error) => {onError(error); });
                  },
                },
              });
            }}

            onChange={(secondaryItem) => {
              let newSecondaryItems = secondaryItems.slice();
              newSecondaryItems[i] = secondaryItem;
              newSecondaryItems = newSecondaryItems.filter(item => item && item._id);
              this.setState({
                _secondaryItems: newSecondaryItems,
                secondaryItems: newSecondaryItems.map(item => ({
                  _id: item._id,
                  _typename: item.__typename,
                })),
              });
            }}
          >
            <input type="text" readOnly className="form-control" placeholder="Secondary Item ID"
              key={`${item._id}_${i}`}
              value={defaultValue(item._id && `${item.__typename} ${item._id}`, '')} />
          </TypeaheadField>
        ))}
      </Fragment>
    );
  }
});

export default () => (
  <ModelPage
    loadQuery={FEATURES_LOAD_QUERY}
    modelName="Feature"
    displayComponent={FeatureDisplay}
    editorComponent={FeatureEdit}
  />
);
