
import React, {Component} from 'react'

export default class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-fixed-top" id={this.props.id}>
                <div className="container">
                    <div className="navbar-header">
                        <button aria-expanded="false" className="navbar-toggle collapsed" data-target="#navbar-collapse" data-toggle="collapse" type="button">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <a className="navbar-brand" href="/">
                            <img src="/img/logo-horizontal.svg" />
                            <h1 className="strong" style={{display: "none"}}>Locust<span className="thin">Walk</span></h1>
                        </a>
                    </div>
                    <div className="collapse navbar-collapse" id="navbar-collapse">
                        <ul className="nav navbar-nav clean">
                            <li><a href="/about">About</a></li>
                            <li><a href="/staff">Staff</a></li>
                            <li><a href="/submissions">Submissions</a></li>
                            <li><a href="/subscribe">Subscribe</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}