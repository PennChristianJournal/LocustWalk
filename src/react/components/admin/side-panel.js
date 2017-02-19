
import React, {Component} from 'react'

export default class SidePanel extends Component {
    render() {
        return (
            <div className="admin-sidebar">
                {this.props.children}
            </div>
        )
    }
}