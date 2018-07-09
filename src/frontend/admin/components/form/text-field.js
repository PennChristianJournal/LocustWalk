import React from 'react';

const TextField = ({label, ...props}) => (
  <div className="form-group">
    <label>{label}</label>
    <input className="form-control" {...props}/>
  </div>
);

export default TextField;
