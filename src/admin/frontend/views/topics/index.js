'use strict';

import React, {Component} from 'react';
import AdminLayout from '~/admin/frontend/templates/admin-layout';
import Modal from '~/admin/frontend/components/modal';
import Table from '~/admin/frontend/components/table';
import TopicEdit from '~/admin/frontend/components/topic-edit';
import TopicEditPanel from '~/admin/frontend/components/topic-edit-panel';
import {debounce} from 'underscore';
import {graphql} from 'react-apollo';
import {headData} from '~/common/frontend/head';
import {TOPIC_LIST_QUERY} from '~/admin/frontend/gql/queries';

class TopicList extends Component {
  render() {
    const {topics, setTopic} = this.props;

    return (
      <Table className="table table-striped" head={
          <tr>
              <th>Title</th>
              <th>Link</th>
              <th>Permalink</th>
          </tr>
      }>
          {topics.map((topic, i) => {
            return (
              <tr key={i} onClick={() => setTopic(topic) }>
                  <td>{topic.title}</td>
                  <td><a href={`/topics/${topic.slug}`}>{`/topics/${topic.slug}`}</a></td>
                  <td><a href={`/topics/${topic._id}`}>{`/topics/${topic._id}`}</a></td>
              </tr>
            );
          })}
      </Table>
    );
  }
}

const TopicListWithData = graphql(TOPIC_LIST_QUERY, {
  options: {
    variables: {
      skip: 0,
    },
    notifyOnNetworkStatusChange: true,
  },
  props({ data: {loading, topics, topicCount, fetchMore}}) {
    topics = topics || [];
    return {
      topics,
      hasMore() {
        return topics.length < topicCount;
      },
      loadMore() {
        if (loading) {
          return;
        }
        return fetchMore({
          variables: {
            skip: topics.length,
          },
          updateQuery(previousResult, {fetchMoreResult}) {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return Object.assign({}, previousResult, {
              topics: [...previousResult.topics, ...fetchMoreResult.topics],
            });
          },
        });
      },
    };
  },
})(TopicList);

class TopicListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
    };
  }

  setTopic(topic) {
    this.setState({
      topic,
    });
  }

  componentDidMount() {
    const container = this.refs.list;
    const table = container.childNodes[0];
    table.addEventListener('mousewheel', debounce((e) => {
      if (e.deltaY > 0 && table.scrollTop + table.offsetHeight > table.scrollHeight - 50) {
        this.loadMore();
      }
    }, 20, true));

    this.loadMore();
  }

  loadMore() {
    const container = this.refs.list;
    const table = container.childNodes[0];
    const body = table.childNodes[1];
    const tableBottom = table.offsetTop + table.offsetHeight;
    const bodyBottom = body.offsetTop + body.offsetHeight;

    const atBottom = table.scrollTop + table.offsetHeight > table.scrollHeight - 50;
    const bodyShort = bodyBottom < tableBottom;

    if ((bodyShort || atBottom) && this.refs.topicList.renderedElement.props.hasMore()) {
      let loaded = this.refs.topicList.renderedElement.props.loadMore();
      if (loaded) {
        loaded.then(this.loadMore.bind(this));
      }
    }
  }

  render() {
    return (
      <AdminLayout id="admin-page" ref="admin-layout">
        <TopicEdit _id={this.state.topic && this.state.topic._id}>
          {(props) => {
            return (
              <Modal
                isOpen={this.state.topic}
                title={`Editing - ${props.stage.values.title}`}
                confirmClose={() => {
                  return !props.stage.hasChangedFields() || confirm(`Are you sure you want to cancel editing "${props.stage.values.title}"? Unsaved changes will be lost!`);
                }}
                onClose={() => {
                  this.setState({
                    topic: null,
                  });
                }}>

                  <TopicEditPanel
                    {...props}
                    onCancel={() => {
                      this.setState({
                        topic: null,
                      });
                    }}
                    onDelete={() => {
                      this.setState({
                        topic: null,
                      });
                    }}
                    onSubmit={() => {
                      this.setState({
                        topic: null,
                      });
                    }}
                  />
              </Modal>
            );
          }}
        </TopicEdit>

        <div className="container" style={{height: '100%'}}>
            <div className="admin-list-view">
                <div className="admin-list-header">
                    <h1>
                        <span>Topics</span>
                        <a className="pull-right btn btn-primary" href="#" onClick={() => {
                          this.setState({
                            topic: {},
                          });
                        }}>New Topic</a>
                    </h1>
                </div>
                <div className="admin-list-content" ref="list">
                    <TopicListWithData ref="topicList" setTopic={this.setTopic.bind(this)} />
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
      href: '/bower_components/medium-editor/dist/css/medium-editor.min.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ]);
})(TopicListPage);
