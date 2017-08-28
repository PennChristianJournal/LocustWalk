'use strict';

import React, {Component} from 'react';
import {graphql, gql} from 'react-apollo';
import {headData} from '~/common/frontend/head';
import AdminLayout from '~/admin/frontend/templates/admin-layout';
import Table from '~/admin/frontend/components/table';
import Modal from '~/admin/frontend/components/modal';
import FeatureEdit from '~/admin/frontend/components/feature-edit';
import FeatureEditPanel from '~/admin/frontend/components/feature-edit-panel';

class FeatureList extends Component {
  render() {
    const {features, setFeature} = this.props;
    return (
      <Table className="table table-striped" head={
        <tr>
          <th>Index</th>
          <th>Title</th>
          <th><i className="fa fa-check" /></th>
        </tr>
      }>
        {features.map((feature, i) => {
          return (
            <tr key={i} onClick={() => setFeature(feature) }>
              <td>{feature.index}</td>
              <td>{feature.title}</td>
              <td>{feature.is_published ? <i className="fa fa-check" /> : null}</td>
            </tr>
          );
        })}
      </Table>
    );
  }
}

const FEATURES_QUERY = gql`
  query ListFeatures($skip: Int!) {
    features(limit: 10, skip: $skip) {
      _id
      title
      index
      is_published
    }
    featureCount
  }
`;

const FeatureListWithData = graphql(FEATURES_QUERY, {
  options: {
    variables: {
      skip: 0,
    },
  },
  props({ data: {loading, features, featureCount, fetchMore}}) {
    features = features || [];
    return {
      features,
      hasMore() {
        return features.length < featureCount;
      },
      loadMore() {
        if (loading) {
          return;
        }
        return fetchMore({
          variables: {
            skip: features.length,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return Object.assign({}, previousResult, {
              features: [...previousResult.features, ...fetchMoreResult.features],
            });
          },
        });
      },
    };
  },
})(FeatureList);

class FeatureListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feature: null,
    };
  }

  setFeature(feature) {
    this.setState({
      feature,
    });
  }

  render() {
    return (
      <AdminLayout id="admin-page" ref="admin-layout">
        <FeatureEdit _id={this.state.feature && this.state.feature._id}>
          {(props) => {
            return (
              <Modal
                width="90%"
                isOpen={this.state.feature}
                title={`Editing - ${props.stage.values.title}`}
                confirmClose={() => {
                  return !props.stage.hasChangedFields() || confirm(`Are you sure you want to cancel editing "${props.stage.values.title}"? Unsaved changes will be lost!`);
                }}
                onClose={() => {
                  this.setState({
                    feature: null,
                  });
                }}>

                  <FeatureEditPanel
                    {...props}
                    onCancel={() => {
                      this.setState({
                        feature: null,
                      });
                    }}
                    onDelete={() => {
                      this.setState({
                        feature: null,
                      });
                    }}
                    onSubmit={() => {
                      this.setState({
                        feature: null,
                      });
                    }}
                  />
              </Modal>
            );
          }}
        </FeatureEdit>
        <div className="container" style={{height: '100%'}}>
            <div className="admin-list-view">
                <div className="admin-list-header">
                    <h1>
                        <span>Features</span>
                        <a className="pull-right btn btn-primary" href="#" onClick={() => {
                          this.setState({
                            feature: {},
                          });
                        }}>New Feature</a>
                    </h1>
                </div>
                <div className="admin-list-content" ref="list">
                  <FeatureListWithData ref="featureList" setFeature={this.setFeature.bind(this)} />
                </div>
            </div>
        </div>
      </AdminLayout>
    );
  }
}

export default headData(head => {
  head.addLink([
    {
      href: '/css/home.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ]);
})(FeatureListPage);
