'use strict';

import React, {Component} from 'react';
import {graphql, gql} from 'react-apollo';
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
          <th>Title</th>
          <th><i className="fa fa-check" /></th>
        </tr>
      }>
        {features.map((feature, i) => {
          return (
            <tr key={i} onClick={() => setFeature(feature) }>
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
  query ListFeatures {
    features {
      _id
      title
      index
      is_published
    }
  }
`;

const FeatureListWithData = graphql(FEATURES_QUERY, {
  props({ data: {features}}) {
    features = features || [];
    return {
      features,
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

export default FeatureListPage;

