
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {getFileURL} from '../helpers/file';
import Optional from './optional';

class FeatureThumb extends Component {
  render() {
    const feature = this.props.feature;
    return (
      <div
          className={this.props.response ? 'feature-response' : 'featured'}
          style={this.props.single ? {width: '100%'} : null}>

          <div className={this.props.response ? 'feature-response-aspect' : this.props.single ? 'featured-block-aspect' : 'featured-aspect'}>
              <div className="content">
                  <a href={feature.url}>
                      <div className="bg-img" style={{backgroundImage: `url(${getFileURL(feature.thumb, feature.thumb_preview_img)})`}}></div>
                      <div className="title-box">
                          <div className="title-img" style={{backgroundImage: `url(${getFileURL(feature.thumb, feature.thumb_preview_img)})`}}></div>
                          <div className="title-bg-darken"></div>
                          <div className="title-content">
                              <h2 className="title">{feature.title}</h2>
                              <p className="author-date h6">
                                  <Optional test={feature.__typename === 'Article'}>
                                    <span>
                                      <span className="author" dangerouslySetInnerHTML={{__html: feature.author + '&nbsp;&#8212;&nbsp;'}}></span>
                                      <span className="date">{moment(feature.date).format('MMM, DD YYYY')}</span>
                                      <br />
                                    </span>
                                  </Optional>
                                  <Optional test={!this.props.response}>
                                    <span className="preview p">{feature.preview}</span>
                                  </Optional>
                              </p>
                          </div>
                      </div>
                  </a>
              </div>
          </div>
      </div>
    );
  }
}

FeatureThumb.propTypes = {
  feature: PropTypes.object.isRequired,
};

class FeatureBlock extends Component {
  render() {
    const secondaryItems = this.props.feature.secondaryItems || [];
    const mainItem = this.props.feature.mainItem || {};
    return (
      <div className="featured-block">
          <div className="feature-month-bar">
              <h2 className="strong feature-month">{this.props.feature.title}</h2>
          </div>
          <div className="feature-block-aspect">
              <div className="content">
                  <Optional test={secondaryItems.length === 2}>
                      <div>
                          <FeatureThumb feature={mainItem} />
                          <FeatureThumb feature={secondaryItems[0] || {}} response />
                          <FeatureThumb feature={secondaryItems[1] || {}} response />
                      </div>
                  </Optional>
                  <Optional test={secondaryItems.length !== 2}>
                      <div>
                          <FeatureThumb feature={mainItem} single />
                      </div>
                  </Optional>
              </div>
          </div>
      </div>
    );
  }
}

FeatureBlock.propTypes = {
  feature: PropTypes.object.isRequired,
};

export default FeatureBlock;
