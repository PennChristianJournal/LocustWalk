
import React, {Component} from 'react'
import Navbar from '../components/navbar'

export default class ArticleLayout extends Component {
    render() {
        return (
            <div className="article-layout" id={this.props.id}>
                <Navbar />
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        )
    }
}