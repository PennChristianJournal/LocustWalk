import React, {Component} from 'react';
import FeatureBlock from '../components/feature-block';

export default class FeatureSlider extends Component {

  constructor(props) {
    super(props);

    this.state = {
      idx: 0,
    };

    this._slideLeft = this.slideLeft.bind(this);
    this._slideRight = this.slideRight.bind(this);
    this._slideNext = this.slideNext.bind(this);
    this._interval = undefined;
  }

  setupInterval() {
    if (typeof this._interval === 'undefined') {
      this._interval = setInterval(this._slideNext, 5000);
    } else {
      clearInterval(this._interval);
      this._interval = undefined;
      this.setupInterval();
    }
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  componentDidMount() {
    this.setupInterval();
  }

  slideNext() {
    if (this.props.features.length - this.state.idx <= 2) {
      if (this.props.hasMore()) {
        this.props.loadMore();
      }
    }

    this.setState({
      idx: Math.min(this.props.features.length - 1, this.state.idx + 1),
    });
  }

  slideLeft() {
    this.setState({
      idx: Math.max(0, this.state.idx - 1),
    });
    this.setupInterval();
  }

  slideRight() {
    this.slideNext();
    this.setupInterval();
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
              <a onClick={this._slideLeft} href="#"><i className="fa fa-chevron-left" /></a>
              <a onClick={this._slideRight} href="#"><i className="fa fa-chevron-right" /></a>
          </div>
      </div>
    );
  }
}
