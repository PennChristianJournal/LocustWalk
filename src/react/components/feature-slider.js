import React, {Component} from 'react'
import FeatureBlock from '../components/feature-block'

export default class FeatureSlider extends Component {

    constructor(props) {
        super(props)

        this.state = {
            idx: 0,
            autoscroll: true
        }

        this.slideLeft = this.slideLeft.bind(this);
        this.slideRight = this.slideRight.bind(this);
        this.interval = undefined;
    }

    setupInterval() {
        const count = this.props.articles.length
        if (count > 1 && typeof this.interval === 'undefined') {
            this.interval = setInterval(() => {
                console.log(1)
                if (this.state.autoscroll) {
                    var idx = this.state.idx + 1;
                    if (idx >= count) idx = 0
                    this.setState({
                        idx: idx
                    })
                }
            }, 5000)
        } else {
            if (typeof this.interval !== 'undefined') {
                clearInterval(this.interval);
                this.interval = undefined;
            }
        }
    }

    componentDidUpdate() {
        this.setupInterval();
    }

    componentDidMount() {
        this.setupInterval();
    }
    
    slideLeft() {
        this.setState({
            autoscroll: false,
            idx: Math.max(0, this.state.idx - 1)
        })
    }

    slideRight() {
        this.setState({
            autoscroll: false,
            idx: Math.min(this.props.articles.length, this.state.idx + 1)
        })
    }

    render() {
        const articles = this.props.articles
        return (
            <div className="featured-view">
                <div className="featured-wrapper" style={{left: this.state.idx * -100 + '%'}}>
                {articles.map((article, i) => 
                    <FeatureBlock article={article} key={i} />
                )}
                </div>
                <div className="feature-nav">
                    <a onClick={this.slideLeft} href="#"><i className="fa fa-chevron-left" /></a>
                    <a onClick={this.slideRight} href="#"><i className="fa fa-chevron-right" /></a>
                </div>
            </div>
        )
    }
}