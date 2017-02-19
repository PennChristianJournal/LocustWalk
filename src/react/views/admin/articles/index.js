
import React, {Component} from 'react'
import AdminLayout from '../../../templates/admin/admin-layout'
import ArticleGroupInfinite from '../../../components/article-group-infinite'
import SidePanel from '../../../components/admin/side-panel'
import ArticleSidebar from '../../../components/admin/article-sidebar'
import Table from '../../../components/admin/table'
import moment from 'moment'
import queryString from 'query-string'

export default class ArticleListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sort: props.sort || 'date',
            page: props.page || 1,
            article: null
        }
    }

    componentDidMount() {
        var params = queryString.parse(location.search)
        this.setState({
            sort: params.sort || this.state.sort,
            page: params.page || this.state.page
        })
    }

    fetchArticles() {
        this.refs.articles.getWrappedInstance().fetchMore();
    }

    setArticle(article) {
        this.setState({
            article
        })
    }

    render() {
        return (
            <AdminLayout id="admin-page" sidebar={<ArticleSidebar imagePreviews article={this.state.article} />} sidebarOpen={this.state.article} >
                <div className="admin-list-view">
                    <div className="admin-list-header">
                        <h1>
                            <span>Articles</span>
                            <a className="pull-right btn btn-primary" href="/admin/articles/new">New Article</a>
                        </h1>
                    </div>
                    <div className="admin-list-content">
                        <ArticleGroupInfinite initialPages={1} ref="articles" name="articles" query={{
                            sort: this.state.sort,
                            limit: 10
                        }}>
                            {articles => (
                                <Table className="table table-striped" head={
                                    <tr>
                                        <th>Title</th>
                                        <th></th>
                                        <th><i className="fa fa-star" /></th>
                                        <th><i className="fa fa-check" /></th>
                                        <th>Posted</th>
                                    </tr>
                                } onScrollBottom={this.fetchArticles.bind(this)}>
                                    {articles.map((article, i) => {
                                        return (
                                            <tr key={i} onClick={() => this.setArticle(article) }>
                                                <td><a href={`/admin/articles/${article._id}/edit`} dangerouslySetInnerHTML={{__html: article.title}}></a></td>
                                                <td><a href={`/articles/${article._id}`}><i className="fa fa-link" /></a></td>
                                                <td>{article.is_featured ? <i className="fa fa-star" /> : null}</td>
                                                <td>{article.is_published ? <i className="fa fa-check" /> : null}</td>
                                                <td>{moment(article.date).format('MMM DD, YYYY [at] H:mm')}</td>
                                            </tr>
                                        )
                                    })}
                                </Table>
                            )}
                        </ArticleGroupInfinite>
                    </div>
                </div>
            </AdminLayout>
        )
    }
}

ArticleListPage.metadata = Object.assign({}, AdminLayout.metadata)

import {mount} from '../../../helpers/page'
mount(ArticleListPage)