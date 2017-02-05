
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchArticlesIfNeeded } from '../actions/articles'

class ArticleGroup extends Component {

    componentDidMount() {
        this.props.setPage(this.props.page || 0);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.page !== this.props.page) {
            this.props.setPage(this.props.page || 0);
        }
    }

    render() {
        if (!this.props.articles.length) return null;
        return this.props.children(this.props.articles);
    }
}

ArticleGroup.propTypes = {
    children: React.PropTypes.func.isRequired
};

export default connect((state, ownProps) => {
    const group = state.articles[ownProps.name] || {};
    const page = ownProps.page || 0;
    const pagegroup = group[page] || {};
    const ids = pagegroup.articles || [];
    return {
        articles: ids.map(id => state.articles.__DB__[id])
    }
}, (dispatch, ownProps) => {
    return {
        setPage: page => dispatch(fetchArticlesIfNeeded(ownProps.name, page, ownProps.query))
    }
})(ArticleGroup)
