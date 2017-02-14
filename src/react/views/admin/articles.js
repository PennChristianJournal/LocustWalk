
import React, {Component} from 'react'
import AdminLayout from '../../templates/admin/admin-layout'
import ArticleGroupInfinite from '../../components/article-group-infinite'
import moment from 'moment'
import queryString from 'query-string'
import { debounce } from 'underscore'

export default class ArticleListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sort: props.sort || 'date',
            page: props.page || 1
        }
    }

    componentDidMount() {
        var params = queryString.parse(location.search)
        this.setState({
            sort: params.sort || this.state.sort,
            page: params.page || this.state.page
        })
        
        var that = this;
        window.addEventListener('mousewheel', debounce((e) => {
            let docHeight = document.body.clientHeight || document.documentElement.clientHeight;
            if (e.deltaY > 0 && window.scrollY + window.innerHeight > docHeight - 50) {
                that.refs.articles.getWrappedInstance().fetchMore();
            }
        }, 20, true));
    }

    render() {
        return (
            <AdminLayout id="admin-page">
                <h1>
                    <span>Articles</span>
                    <a className="pull-right btn btn-primary" href="/admin/articles/new">New Article</a>
                </h1>
                <ArticleGroupInfinite initialPages={1} ref="articles" name="articles" query={{
                    sort: this.state.sort,
                    limit: 10
                }}>
                    {articles => (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th></th>
                                    <th><i className="fa fa-star" /></th>
                                    <th><i className="fa fa-check" /></th>
                                    <th>Posted</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map((article, i) => {
                                    return (
                                        <tr key={i}>
                                            <td><a href={`/admin/articles/${article._id}/edit`} dangerouslySetInnerHTML={{__html: article.title}}></a></td>
                                            <td><a href={`/articles/${article._id}`}><i className="fa fa-link" /></a></td>
                                            <td>{article.is_featured ? <i className="fa fa-star" /> : null}</td>
                                            <td>{article.is_published ? <i className="fa fa-check" /> : null}</td>
                                            <td>{moment(article.date).format('MMM DD, YYYY [at] H:mm')}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </ArticleGroupInfinite>
            </AdminLayout>
        )
    }
}

ArticleListPage.metadata = Object.assign({}, AdminLayout.metadata)

import {mount} from '../../helpers/page'
mount(ArticleListPage)