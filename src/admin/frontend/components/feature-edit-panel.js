'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import TypeaheadInput from './typeahead-input';

export default class FeatureEditPanel extends Component {
  handleSubmit(event) {
    event.preventDefault();
    this.props.submit().then(this.props.onSubmit);
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

    var mainType = (feature.mainItem && feature.mainItem.__typename) || '';
    var mainID = (feature.mainItem && feature.mainItem._id) || '';
    return (
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
          <TypeaheadInput key={feature.mainItem && feature.mainItem._id} type="text" className="form-control" placeholder="Main Item" defaultValue={feature.mainItem && feature.mainItem.title}

            typeaheadConfig={{
              hint: true,
              highlight: true,
              minLength: 1,
              display: 'title',
            }}

            createBloodhoundConfig={function(Bloodhound) {
              return new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace('title'),
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

            target={ (value, datum) => {
              this.props.stage.update('mainItem', Object.assign({}, {
                _id: datum._id,
                title: datum.title,
                _typename: datum.__typename,
              }));
            }}
            targetField="_id"
          />
          <span>{`${mainType} ${mainID}`}</span>
          <input type="hidden" readOnly className="form-control" placeholder="Main Item Type" value={mainType} />
          <input type="hidden" readOnly className="form-control" placeholder="Main Item ID" value={mainID} />
        </div>

        <div className="form-group">
          <label>Secondary Items</label>
        </div>
        {(feature.secondaryItems || []).map((item, index) => {
          var type = item.__typename || '';
          var id = item._id || '';
          return (
            <div className="form-group" key={index + id}>
              <TypeaheadInput type="text" className="form-control" placeholder="Secondary Item" defaultValue={item && item.title}

                typeaheadConfig={{
                  hint: true,
                  highlight: true,
                  minLength: 1,
                  display: 'title',
                }}

                createBloodhoundConfig={function(Bloodhound) {
                  return new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.whitespace('title'),
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

                target={ (value, datum) => {
                  var arr = feature.secondaryItems.slice();
                  arr[index] = Object.assign({}, {
                    _id: datum._id,
                    title: datum.title,
                    _typename: datum.__typename,
                  });
                  this.props.stage.update('secondaryItems', arr);
                }}
                targetField="_id"
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
          <a className="btn btn-success" onClick={() => {this.props.stage.update('secondaryItems', feature.secondaryItems.concat([{}])); } }>Add</a>
        </div>

        <div className="btn-toolbar">
          <button className="btn btn-primary" type="submit">Save</button>
          <a className="btn btn-default" onClick={this.handleCancel.bind(this)}>Cancel</a>
          <a className="btn btn-danger pull-right" onClick={this.handleDelete.bind(this)}>Delete</a>
        </div>
      </form>
    );
  }
}

FeatureEditPanel.propTypes = {
  stage: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
};

