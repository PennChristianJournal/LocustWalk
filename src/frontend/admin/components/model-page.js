import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router/Switch';
import Route from 'react-router/Route';
import {Link, withRouter} from 'react-router-dom';
import pluralize from 'pluralize';
import {parse as queryString} from 'query-string';
import {debounce} from 'underscore';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import Modal from '../components/modal';
import Notification, {pushNotification} from '../components/notification';

class ModalEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open
    }

    this.notifications = [];
    this._closeModal = this.closeModal.bind(this);
    this._confirmCancel = this.confirmCancel.bind(this);
    this._handleCancel = this.handleCancel.bind(this);
    this._handleSave = this.handleSave.bind(this);
    this._handleDelete = this.handleDelete.bind(this);
  }

  closeModal() {
    this.setState({
      open: false,
    }, () => {
      // Wait for modal to close before pushing history
      setTimeout(() => {
        const page = this.props.page;
        if (page.props.history.action === 'PUSH') {
          page.props.history.goBack();
        } else {
          page.props.history.replace({
            pathname: page.props.match.url,
            search: page.props.location.search,
          });
        }
      }, 300);
    });
  }

  confirmCancel() {
    return !this.editorComponent.hasChanges() || confirm('Are you sure you want to cancel?');
  }

  get editorComponent() {
    let component = this.refs.editor;
    while (component.getWrappedInstance) {
      component = component.getWrappedInstance();
    }
    return component;
  }

  cancel() {
    if (this.confirmCancel()) {
      this.closeModal();
      this.refs.modal.close();
    }
  }

  handleCancel() {
    this.cancel();
  }

  handleSave() {
    const savingNotification = pushNotification('warning', 'Saving...');
    this.notifications.push(savingNotification);
    this.editorComponent.submit().then(() => {
      // savingNotification.close();
      this.closeModal();
      this.refs.modal.close();
    }).catch(console.error);
  }

  handleDelete() {
    this.editorComponent.delete().then(() => {
      this.closeModal();
      this.refs.modal.close();
    }).catch(console.error);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open != this.state.open) {
      this.setState({
        open: nextProps.open,
      });
    }
  }

  render() {
    // console.log(this.notifications);
    return (
      <Fragment>
        {/* {this.notifications} */}
        {this.notifications.map((notification, i) => React.cloneElement(notification, {
          ref(n) {
            console.log(n);
          }
        }))}
        <Modal ref="modal"
            isOpen={this.state.open}
            onClose={this._closeModal}
            confirmClose={this._confirmCancel}
            title={this.props.title}
            footer={
              <Fragment>
                <button type="button" className="btn btn-danger mr-auto" disabled={this.props.isNew} onClick={this._handleDelete}>Delete</button>
                <button type="button" className="btn btn-primary" onClick={this._handleSave}>Save</button>
                <button type="button" className="btn btn-light" onClick={this._handleCancel}>Cancel</button>
              </Fragment>
            }>
          <form>{this.props.editorComponent ? <this.props.editorComponent
            isNew={this.props.isNew}
            id={this.props.id}
            ref="editor"
          /> : null}</form>
        </Modal>
      </Fragment>
    );
  }
};

function withDocuments(WrappedComponent) {
  return ({loadQuery, search, ...props}) => {
    const WithDocuments = graphql(loadQuery, {
      options(ownProps) {
        return {
          variables: {
            limit: 10,
            skip: 0,
            search,
          },
          notifyOnNetworkStatusChange: true,
        };
      },
      props({ data: {loading, documents, documentCount, fetchMore}}) {
        documents = documents || [];
        return {
          documents,
          hasMore() {
            return documents.length < documentCount;
          },
          loadMore() {
            if (loading) {
              return;
            }
            return fetchMore({
              variables: {
                skip: documents.length,
              },
              updateQuery(previousResult, {fetchMoreResult}) {
                if (!fetchMoreResult) {
                  return previousResult;
                }
                return Object.assign({}, previousResult, {
                  documents: [...previousResult.documents, ...fetchMoreResult.documents],
                });
              },
            });
          },
        };
      },
    })(WrappedComponent);

    return <WithDocuments key={search} {...props} />;
  }
}

const DocumentList = withDocuments(class extends Component {
  constructor(props) {
    super(props);
    this._checkLoadMore = this.checkLoadMore.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this._checkLoadMore);
    window.addEventListener('resize', this._checkLoadMore);
    this._checkLoadMore();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._checkLoadMore);
    window.removeEventListener('resize', this._checkLoadMore);
  }

  checkLoadMore(e) {
    if (this.props.hasMore()) {
      const rect = this.refs.container.getBoundingClientRect();
      if (rect.y + rect.height - window.innerHeight < 200) {
        this.props.loadMore();
      }
    }
  }

  render() {
    return (
      <div ref="container">
        {this.props.documents.map(document => <this.props.displayComponent document={document} key={document._id} />)}
      </div>
    );
  }
});

class ModelPage extends Component {
  constructor(props) {
    super(props);
    this._handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    e.preventDefault();
    this.props.history.replace({
      pathname: this.props.match.url,
      search: `?search=${this.refs.searchInput.value}`
    });
  }

  render() {
    const query = queryString(this.props.location.search);
    return (
      <div className="container">
        <div className="admin-list-view">
          <h1>
              <span>{pluralize(this.props.modelName)}</span>
              <Link className="pull-right btn btn-primary" to={`${this.props.match.url}/new${this.props.location.search}`}>{`New ${this.props.modelName}`}</Link>
          </h1>
          <form onSubmit={this._handleSearch}>
            <div className="input-group">
              <input ref="searchInput" type="text" placeholder="Search" className="form-control" name="search" defaultValue={query.search || ''} />
              <div className="input-group-append">
                <button className="btn btn-secondary" type="submit"><i className="fa fa-search"/></button>
              </div>
            </div>
          </form>
          <Switch>
            <Route path={`${this.props.match.url}/new`} render={(props) => (
              <ModalEditForm
                page={this}
                open={true}
                title={`New ${this.props.modelName}`}
                editorComponent={this.props.editorComponent}
                isNew={true}
              />
            )} />
            <Route path={`${this.props.match.url}/:id/edit`} render={(props) => (
              <ModalEditForm
                page={this}
                open={true}
                title={`Editing ${this.props.modelName}`}
                editorComponent={this.props.editorComponent}
                id={props.match.params.id}
              />
            )} />
            <Route render={(props) => (
              <ModalEditForm page={this} open={false} />
            )} />
          </Switch>
          <DocumentList key={this.props.match.url} loadQuery={this.props.loadQuery} displayComponent={this.props.displayComponent} search={query.search || ''} />
        </div>
      </div>
    );
  };
};

ModelPage.propTypes = {
  modelName: PropTypes.string.isRequired,
  loadQuery: PropTypes.object.isRequired,
  displayComponent: PropTypes.func.isRequired,
  editorComponent: PropTypes.func.isRequired,
};

export default withRouter(ModelPage);
