
import React, { Component } from 'react'
import moment from 'moment'
import { htmlPreview } from '../helpers/format'

export default class ArticleThumb extends Component {
    render() {
        const article = this.props.article;
        return (
            <div className="article-thumb-block">
                <div className="thumb">
                    <a href={`/articles/${article.slug}`}>
                        <div className="thumb-aspect" style={{
                            backgroundImage: article.thumb
                        }}></div>
                    </a>
                </div>
                <div className="article-thumb-content">
                    <a href={`/articles/${article.slug}`}>
                        <h2 className="title" dangerouslySetInnerHTML={{__html: article.title}} />
                    </a>
                    <p className="author-date h6">
                        <span className="author">{article.author}&#8212;&nbsp;</span>
                        <span className="date">{moment(article.date).format('MMM, DD YYYY')}</span>
                    </p>
                    <p className="preview" dangerouslySetInnerHTML={{__html: htmlPreview(article.content, 300)}}/>
                </div>
            </div>
        )
    }
}

ArticleThumb.propTypes = {
    article: React.PropTypes.object.isRequired
};