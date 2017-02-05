
import React, { Component } from 'react'
import ArticleGroup from './article-group'
import ArticleThumb from './article-thumb'
import Optional from './optional'
import moment from 'moment'

const ResponseTo = (article) => (
    <div className="response-to" data-article-id={article._id}>
        <h2>In Response To:&nbsp;
            <a className="response-title" href={`/articles/${article.slug}`} dangerouslySetInnerHTML={{__html: article.title}}></a>
        </h2>
    </div>
)

export default class ArticleMain extends Component {
    render() {
        const article = this.props.article;
        return (
            <div className="article" data-article-id={article._id}>
                <div className="container">
                    <Optional test={article.cover}>
                        <div className="article-cover" style={{backgroundImage: `url("/files/${article.cover}")`}} />
                        <div className="nav-mask">
                            <div className="article-cover-blur" style={{backgroundImage: `url("/files/${article.cover}")`}}></div>
                            <div className="nav-mask-bg" />
                        </div>
                    </Optional>
                    <Optional test={!article.cover}>
                        <style>{`
                            nav.navbar {
                                background-color: #222;
                            }
                        `}</style>
                        <div style={{marginTop: '80px'}} />
                    </Optional>

                    <Optional test={article.parent}>
                        <ArticleGroup name="parent" query={{
                            _id: article.parent,
                            published: true,
                            limit: 1
                        }}>
                            { articles => ResponseTo(articles[0]) }
                        </ArticleGroup>
                    </Optional>

                    <h1 className="article-title strong" dangerouslySetInnerHTML={{__html: article.title}} />
                    <h4 className="article-author-date thin">{article.author} &#8212; {moment(article.date).format('MMM, DD YYYY')}</h4>
                    <div className="article-content" dangerouslySetInnerHTML={{__html: article.content}}></div>

                    <ArticleGroup name="responses" query={{
                        parent: article._id,
                        published: true
                    }}>
                        { responses =>
                            <Optional test={responses && responses.length}>
                                <div className="tile tile-vertical gray-theme">
                                    <h1 className="strong">Discussion</h1>
                                    {responses.map((response, i) => {
                                        return (
                                            <div className="discussion tile tile-vertical gray-theme" key={i}>
                                                <ArticleThumb article={response} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </Optional>
                        }
                    </ArticleGroup>
                </div>
            </div>
        )
    }
}

ArticleMain.propTypes = {
    article: React.PropTypes.object.isRequired
};