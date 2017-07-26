'use strict';
import React, {Component} from 'react';

function makeEmptyObject() {
  return {};
}

export function editingContext({
  createStage = makeEmptyObject,
  props = makeEmptyObject,
}) {
  return function(WrappedComponent) {
    return class extends Component {
      constructor(ownProps) {
        super(ownProps);
        this.state = {
          stage: createStage(ownProps),
        };
      }

      componentWillReceiveProps(nextProps) {
        this.setState({ stage: createStage(nextProps, this.state.stage) });
      }

      generateProps() {
        let self = this;
        let stage = {
          values: Object.assign({}, self.state.stage),
          update(property, value, cb) {
            self.setState({stage: Object.assign({}, self.state.stage, {
              [property]: value,
            })}, cb);
          },
          clear(cb) {
            self.setState({ stage: {} }, cb);
          },
          reset(cb) {
            self.setState({ stage: createStage(self.props, {}) || {}, cb });
          },
          getChangedFields() {
            const base = createStage(self.props, {});
            return Object.keys(stage.values).filter(key => stage.values[key] != base[key]);
          },
          hasChangedFields() {
            return stage.getChangedFields().length > 0;
          },
        };

        return {
          ...this.props,
          stage,
          ...props(this.props, stage),
        };
      }

      render() {
        return <WrappedComponent {...this.generateProps()} />;
      }
    };
  };
}
