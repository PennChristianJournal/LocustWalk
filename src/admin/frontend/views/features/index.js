'use strict';

import React, {Component} from 'react';
import {compose, graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {debounce} from 'underscore';
import {headData} from '~/common/frontend/head';
import AdminLayout from '~/admin/frontend/templates/admin-layout';
import Table from '~/admin/frontend/components/table';
import Modal from '~/admin/frontend/components/modal';
import FeatureEdit from '~/admin/frontend/components/feature-edit';
import FeatureEditPanel from '~/admin/frontend/components/feature-edit-panel';
import {FEATURE_UPDATE} from '~/admin/frontend/gql/mutations';

class FeatureList extends Component {
  render() {
    const {features, setFeature, swapIndices} = this.props;

    function swap(event, src, tgt) {
      event.stopPropagation();
      if (tgt < 0 || tgt >= features.length) {
        return;
      }
      swapIndices(src, tgt);
    }

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
            <tr key={i + feature._id} onClick={() => setFeature(feature) }>
              <td>
                <a href="#" onClick={e => swap(e, i, i - 1)}><i className="fa fa-chevron-up"/></a>&nbsp;
                {feature.index}&nbsp;
                <a href="#" onClick={e => swap(e, i, i + 1)}><i className="fa fa-chevron-down"/></a>
              </td>
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

const FeatureListWithData = compose(
  graphql(FEATURES_QUERY, {
    options: {
      variables: {
        skip: 0,
      },
    },
    props({ data: {refetch, loading, features, featureCount, fetchMore}}) {
      features = features || [];
      return {
        refetch,
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
  }),
  graphql(FEATURE_UPDATE, {
    name: 'updateFeature',
    props({ownProps: {features, refetch, onRefetch}, updateFeature}) {
      function refetchFunc() {
        return refetch().then(() => {
          if (onRefetch) {
            return onRefetch();
          } else {
            return Promise.resolve();
          }
        });
      }

      return {
        swapIndices(src, tgt) {
          Promise.all([
            updateFeature({
              variables: {
                _id: features[src]._id,
                feature: {
                  index: features[tgt].index,
                },
              },
            }),
            updateFeature({
              variables: {
                _id: features[tgt]._id,
                feature: {
                  index: features[src].index,
                },
              },
            }),
          ]).then(refetchFunc);
        },
      };
    },
  }),
)(FeatureList);

class FeatureListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feature: null,
    };
  }

  componentDidMount() {
    const container = this.refs.list;
    const table = container.childNodes[0];
    table.addEventListener('mousewheel', debounce((e) => {
      if (e.deltaY > 0 && table.scrollTop + table.offsetHeight > table.scrollHeight - 50) {
        this.loadMoreFeatures();
      }
    }, 20, true));

    this.loadMoreFeatures();
  }

  fetchFeatures(cb) {
    this.refs.articles.getWrappedInstance().fetchMore(cb);
  }

  hasMoreFeatures() {
    return this.refs.articles.getWrappedInstance().hasMore();
  }

  setFeature(feature) {
    this.setState({
      feature,
    });
  }

  loadMoreFeatures() {
    const container = this.refs.list;
    const table = container.childNodes[0];
    const body = table.childNodes[1];
    const tableBottom = table.offsetTop + table.offsetHeight;
    const bodyBottom = body.offsetTop + body.offsetHeight;

    const atBottom = table.scrollTop + table.offsetHeight > table.scrollHeight - 50;
    const bodyShort = bodyBottom < tableBottom;

    if ((bodyShort || atBottom) && this.refs.featureList.renderedElement.props.hasMore()) {
      let loaded = this.refs.featureList.renderedElement.props.loadMore();
      if (loaded) {
        loaded.then(this.loadMoreFeatures.bind(this));
      }
    }
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
                  <FeatureListWithData ref="featureList" setFeature={this.setFeature.bind(this)} onRefetch={this.loadMoreFeatures.bind(this)} />
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
