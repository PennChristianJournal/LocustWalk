import React, {Component} from 'react';
import FeatureBlock from '../components/feature-block';

export default class FeatureSlider extends Component {

  constructor(props) {
    super(props);

    this.state = {
      idx: 0,
      autoscroll: true,
      loadPromise: Promise.resolve(),
    };

    this.slideLeft = this.slideLeft.bind(this);
    this.slideRight = this.slideRight.bind(this);
    this.interval = undefined;
  }

  setupInterval() {
    if (typeof this.interval === 'undefined') {
      this.interval = setInterval(() => {
        if (this.state.autoscroll) {
          var idx = this.state.idx + 1;
          if (idx >= this.props.features.length) {
            idx = 0;
          }
          this.setState({
            idx: idx,
          });
        }
      }, 5000);
    } else {
      if (typeof this.interval !== 'undefined') {
        clearInterval(this.interval);
        this.interval = undefined;
      }
    }
  }

  // checkLoadMore() {
  //   if (this.props.loadMore) {
  //     if (this.props.articles.length - this.state.idx < 2) {
  //       this.props.loadMore();
  //     }
  //   }
  // }

  componentDidUpdate() {
    this.setupInterval();
  }

  componentDidMount() {
    this.setupInterval();
  }

  slideLeft() {
    this.setState({
      autoscroll: false,
      idx: Math.max(0, this.state.idx - 1),
    });
  }

  slideRight() {
    this.setState({
      autoscroll: false,
      idx: Math.min(this.props.features.length - 1, this.state.idx + 1),
    });
  }

  render() {
    const features = this.props.features;
    return (
      <div className="featured-view">
          <div className="featured-wrapper" style={{left: this.state.idx * -100 + '%'}}>
          {features.map((feature, i) =>
            <FeatureBlock feature={feature} key={i} />
          )}
          </div>
          <div className="feature-nav">
              <a onClick={this.slideLeft} href="#"><i className="fa fa-chevron-left" /></a>
              <a onClick={this.slideRight} href="#"><i className="fa fa-chevron-right" /></a>
          </div>
      </div>
    );
  }
}
