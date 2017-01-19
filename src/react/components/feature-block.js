
import React, { Component } from 'react'
import {articleHeading} from '../helpers/article'
import moment from 'moment'
import {htmlPreview} from '../helpers/format'

class FeatureThumb extends Component {
    render() {
        var article = this.props.article
        return (
            <div className={this.props.response ? "feature-response" : "featured"}>
                <div className={this.props.response ? "feature-response-aspect" : "featured-block-aspect"}>
                    <div className="content">
                        <a href={`/articles/${article.slug}`}>
                            <div className="bg-img" style={{backgroundImage: `url("/files/${article.thumb}")`}}></div>
                            <div className="title-box">
                                <div className="title-img" style={{backgroundImage: `url("/files/${article.thumb}")`}}></div>
                                <div className="title-bg-darken"></div>
                                <div className="title-content">
                                    <h2 className="title" dangerouslySetInnerHTML={{__html: article.title}} />
                                    <p className="author-date h6">
                                        <span className="author" dangerouslySetInnerHTML={{__html: article.author + '&nbsp;&#8212;&nbsp;'}}></span>
                                        <span className="date">{moment(article.date).format('MMM, DD YYYY')}</span>
                                        <br />
                                        {this.props.response ? null : 
                                        <span className="preview p">{htmlPreview(article.content, 140)}</span>
                                        }
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

FeatureThumb.propTypes = {
    article: React.PropTypes.object.isRequired
}

export default class FeatureBlock extends Component {
    render() {
        var article = this.props.article
        return (
            <div className="featured-block">
                <div className="feature-month-bar">
                    <h2 className="strong feature-month">{articleHeading(article)}</h2>
                </div>
                <div className="feature-block-aspect">
                    <div className="content">
                        <FeatureThumb article={article} />
                        <FeatureThumb article={article} response />
                        <FeatureThumb article={article} response />
                    </div>
                </div>
            </div>
        )
    }
}

FeatureBlock.propTypes = {
    article: React.PropTypes.object.isRequired
};