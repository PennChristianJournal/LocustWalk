'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {notificationConnect} from '~/admin/frontend/components/notification-context';
import $ from 'jquery';
import TypeaheadInput from './typeahead-input';
import FeatureSlider from '~/common/frontend/components/feature-slider';

class FeatureEditPanel extends Component {
  handleSubmit(event) {
    event.preventDefault();
    const title = this.props.stage.values.title;

    const closeNotification = this.props.pushNotification('warning', `Saving "${title}"...`);

    this.props.submit().then(() => {
      setTimeout(this.props.pushNotification('success', `Successfully saved "${title}"`), 5000);
    }).then(this.props.onSubmit).catch(error => {
      this.props.pushNotification('danger', error.toString());
    }).then(closeNotification);
  }

  handleCancel(event) {
    if (!this.props.stage.hasChangedFields() || confirm(`Are you sure you want to cancel editing "${this.props.stage.values.title}"? Unsaved changes will be lost!`)) {
      this.props.cancel(this.props.onCancel);
    }
  }

  handleDelete(event) {
    if (confirm(`Are you sure you want to delete "${this.props.stage.values.title}?"`)) {
      this.props.delete().then(this.props.onDelete);
    }
  }

  render() {
    const feature = this.props.stage.values;

    var mainType = (feature.mainItem && (feature.mainItem._typename || feature.mainItem.__typename)) || '';
    var mainID = (feature.mainItem && feature.mainItem._id) || '';
    return (
      <div className="row">
        <div className="container">
          <FeatureSlider features={[feature]} />
        </div>
        <div className="col-lg-12">
          <form onSubmit={this.handleSubmit.bind(this)} className="form" key={feature._id}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" className="form-control" placeholder="Feature Title" value={feature.title} onChange={ e => { this.props.stage.update('title', e.target.value); } } />
            </div>

            <div className="form-group">
                <div className="checkbox">
                    <label className="checkbox-inline">
                        <input type="checkbox"
                          checked={feature.is_published || false}
                          onChange={e => this.props.stage.update('is_published', e.target.checked) }
                        />
                        Published
                    </label>
                </div>
            </div>

            <div className="form-group">
              <label>Main Item</label>
              <TypeaheadInput
                labelKey="title"
                query={`
                  query FeaturesSearch($title: String!) {
                    searchFeatureItems(title: $title) {
                      _id
                      title
                      __typename
                      thumb
                      preview(length: 100)
                      ...on Article {
                        date
                        author
                      }
                    }
                  }
                `}
                getVariables={query => {
                  return {
                    title: query,
                  };
                }}
                onChange={selectedItems => {
                  const selected = selectedItems[0];
                  if (selected) {
                    this.props.stage.update('mainItem', Object.assign({
                      _typename: selected.__typename,
                    }, selected));
                  }
                }}
                minLength={1}
                defaultSelected={feature._id ? [feature] : undefined}
              />
              <span>{`${mainType} ${mainID}`}</span>
              <input type="hidden" readOnly className="form-control" placeholder="Main Item Type" value={mainType} />
              <input type="hidden" readOnly className="form-control" placeholder="Main Item ID" value={mainID} />
            </div>

            <div className="form-group">
              <label>Secondary Items</label>
            </div>
            {(feature.secondaryItems || []).map((item, index) => {
              var type = item._typename || item.__typename || '';
              var id = item._id || '';
              return (
                <div className="form-group" key={index + id}>
                  <TypeaheadInput
                    labelKey="title"
                    query={`
                      query FeaturesSearch($title: String!) {
                        searchFeatureItems(title: $title) {
                          _id
                          title
                          __typename
                          thumb
                          preview(length: 100)
                          ...on Article {
                            date
                            author
                          }
                        }
                      }
                    `}
                    getVariables={query => {
                      return {
                        title: query,
                      };
                    }}
                    onChange={selectedItems => {
                      const selected = selectedItems[0];
                      if (selected) {
                        var arr = feature.secondaryItems.slice();
                        arr[index] = Object.assign({
                          _typename: selected.__typename,
                        }, selected);
                        this.props.stage.update('secondaryItems', arr);
                      }
                    }}
                    minLength={1}
                    defaultSelected={item._id ? [item] : undefined}
                  />
                  <span>{`${type} ${id}`}</span>
                  <input type="hidden" readOnly className="form-control" placeholder="Secondary Item Type" value={type} />
                  <input type="hidden" readOnly className="form-control" placeholder="Secondary Item ID" value={id} />
                  <a className="btn btn-xs btn-danger pull-right" onClick={() => {
                    var arr = feature.secondaryItems.slice();
                    arr.splice(index, 1);
                    this.props.stage.update('secondaryItems', arr);
                  }}>Remove</a>
                  <div className="clearfix" />
                </div>
              );
            })}
            <div className="form-group">
              <a className="btn btn-success" onClick={() => {this.props.stage.update('secondaryItems', (feature.secondaryItems || []).concat([{}])); } }>Add</a>
            </div>

            <div className="btn-toolbar">
              <button className="btn btn-primary" type="submit">Save</button>
              <a className="btn btn-default" onClick={this.handleCancel.bind(this)}>Cancel</a>
              <a className="btn btn-danger pull-right" onClick={this.handleDelete.bind(this)}>Delete</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

FeatureEditPanel.propTypes = {
  stage: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
};

export default notificationConnect('notifications')(FeatureEditPanel);
