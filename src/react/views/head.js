
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Optional from '../components/optional'

function flatten(arr) {
    return arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
}

class Head extends Component {
    render() {
        return (
            <head>
            {flatten([
                this.props.link.map(function(props) {
                    return <link {...props} />
                }),
                this.props.meta.map(function(props) {
                    const {property, properties, ...rest} = props;
                    if (property) {
                        return <meta property={property} {...rest}></meta>
                    } else if (properties) {
                        return properties.map(function(property) {
                            return <meta property={property} {...rest}></meta>
                        })
                    } else {
                        return <meta {...rest}></meta>
                    }
                }),
                <Optional test={this.props.title}><title>{this.props.title}</title></Optional>
            ])}
            </head>
        )
    }
}

export default connect((state, ownProps) => {
    const {metadata} = ownProps;
    const {meta, link, title} = metadata || {};

    var props = Object.assign({}, state.metadata);
    if (title) props.title = title;
    if (meta) props.meta = props.meta.concat(meta);
    if (link) props.link = props.link.concat(link);

    return props
})(Head)