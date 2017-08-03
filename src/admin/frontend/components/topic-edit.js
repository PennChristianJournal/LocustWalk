'use strict';

import {Component} from 'react';
import PropTypes from 'prop-types';
import {compose, graphql} from 'react-apollo';
import { editingContext } from './editing-context';
import {TOPIC_QUERY, TOPIC_LIST_QUERY} from '../gql/queries';
import {TOPIC_NEW, TOPIC_UPDATE, TOPIC_DELETE} from '../gql/mutations';

const editableTopicFields = [
  'title',
  'content',
  'slug',
  'cover_buffer',
  'thumb_buffer',
];

class TopicEdit extends Component {
  render() {
    return !this.props.children ? null : this.props.children(this.props);
  }
}

TopicEdit.propTypes = {
  children: PropTypes.func,
};

export default compose(
  graphql(TOPIC_QUERY, {
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
    props({ data: { loading, topic }}) {
      return {
        topic,
        loading,
      };
    },
  }),
  graphql(TOPIC_NEW, {
    name: 'newTopic',
    props({newTopic}) {
      return {
        newTopic: (topic) => newTopic({
          variables: {
            topic,
          },
          update: (store, { data: { newTopic } }) => {
            const data = store.readQuery({
              query: TOPIC_LIST_QUERY,
              variables: {
                skip: 0,
              },
            });
            store.writeQuery({
              query: TOPIC_LIST_QUERY,
              data: Object.assign({}, data, {
                topics: [newTopic, ...data.topics],
              }),
              variables: {
                skip: 0,
              },
            });
          },
        }),
      };
    },
  }),
  graphql(TOPIC_UPDATE, {
    skip(props) {
      return !props._id;
    },
    name: 'updateTopic',
    props({ownProps, updateTopic}) {
      return {
        updateTopic: (topic) => updateTopic({
          variables: {
            _id: ownProps._id,
            topic,
          },
        }),
      };
    },
  }),
  graphql(TOPIC_DELETE, {
    skip(props) {
      return !props._id;
    },
    name: 'deleteTopic',
    props({ownProps, deleteTopic}) {
      return {
        deleteTopic: () => deleteTopic({
          variables: {
            _id: ownProps._id,
          },
          update: (store, { data: { deleteTopic } }) => {
            const data = store.readQuery({
              query: TOPIC_LIST_QUERY,
              variables: {
                skip: 0,
              },
            });

            let index = data.topics.findIndex(el => el._id == deleteTopic._id);
            if (index < 0) {
              return;
            }

            store.writeQuery({
              query: TOPIC_LIST_QUERY,
              data: Object.assign({}, data, {
                topics: [...data.topics.slice(0, index), ...data.topics.slice(index + 1, data.topics.length)],
              }),
              variables: {
                skip: 0,
              },
            });
          },
        }),
      };
    },
  }),
  editingContext({
    createStage({topic = {}}, stage = {}) {
      if (!topic || !topic._id) {
        return {};
      } else if (topic._id != stage._id) {
        return Object.assign({}, topic);
      } else {
        return Object.assign({}, topic, stage);
      }
    },
    props(ownProps, stage) {
      return {
        submit() {
          const isNew = !stage.values._id;
          const params = (isNew ? Object.keys(stage.values) : stage.getChangedFields())
            .filter(key => editableTopicFields.includes(key))
            .reduce((obj, key) => {
              obj[key] = stage.values[key];
              return obj;
            }, {});

          if (isNew) {
            return ownProps.newTopic(params);
          } else {
            return ownProps.updateTopic(params);
          }
        },
        cancel(cb) {
          stage.clear(cb);
        },
        delete() {
          if (!ownProps.deleteTopic) {
            return Promise.resolve();
          }
          return ownProps.deleteTopic();
        },
      };
    },
  }),
)(TopicEdit);
