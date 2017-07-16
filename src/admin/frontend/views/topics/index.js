'use strict';

import React, {Component} from 'react';
import AdminLayout from '~/admin/frontend/templates/admin-layout';
import Modal from '~/admin/frontend/components/modal';
import Table from '~/admin/frontend/components/table';
import Optional from '~/common/frontend/components/optional';
import TopicEditPanel from '~/admin/frontend/components/topic-edit-panel';
import {debounce} from 'underscore';
import {graphql, gql} from 'react-apollo';
import {headData} from '~/common/frontend/head';

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

const TOPIC_SEARCH_QUERY = gql`
  query SearchTopics($skip: Int!) {
    topics(limit: 10, skip: $skip) {
      _id
      title
      slug
    }
    topicCount
  }
`;

const TopicListWithData = graphql(TOPIC_SEARCH_QUERY, {
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
      this.refs.topicList.renderedElement.props.loadMore().then(this.loadMore.bind(this));
    }
  }
  
  render() {
    return (
      <AdminLayout id="admin-page" ref="admin-layout">
        <Modal
          isOpen={this.state.topic}
          title={this.state.topic && `Editing - ${this.state.topic.title}`}
          confirmClose={() => {
            return confirm(`Are you sure you want to cancel editing "${this.state.topic.title}"? Unsaved changes will be lost!`);
          }}
          onClose={() => {
            this.setState({
              topic: null,
            });
          }}>
          
          <Optional test={this.state.topic}>
            <TopicEditPanel
              _id={this.state.topic && this.state.topic._id}
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
          </Optional>
        </Modal>
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
