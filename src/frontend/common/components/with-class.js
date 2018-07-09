import React from 'react';

export default function withClass(cls, Wrapped) {
  const WithClass = (props) => {
    const {className, ...rest} = props;
    return <Wrapped className={`${className || ''} ${cls}`} {...rest} />;
  };
  return WithClass;
}
