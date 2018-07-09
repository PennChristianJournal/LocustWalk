import React from 'react';

const BooleanField = ({label, onChange, ...props}) => (
  <div className="form-check">
    <input type="checkbox" className="form-check-input" {...props} onChange={(e) => {
      if (onChange) {
        onChange(Object.assign({}, {
          target: Object.assign({}, e.target, {
            value: e.target.checked,
            name: e.target.name,
          })
        }));
      }
    }} />
    <label className="form-check-label">{label}</label>
  </div>
);

export default BooleanField;
