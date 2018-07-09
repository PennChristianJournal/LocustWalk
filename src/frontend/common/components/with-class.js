import React from 'react';

export default function withClass(Wrapped, classes...) {
  const WithClass = (props) => {
    const {className, ...rest} = props;
    return <Wrapped className={`${className || ''} ${...classes}`} {...rest} />;
  };
  return WithClass;
}
