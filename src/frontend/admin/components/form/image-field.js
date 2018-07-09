import React from 'react';
import {getFileURL} from '../../../common/helpers/file';

const ImageField = ({name, label, src, preview, onChange}) => (
  <div className="form-group">
    <label>{label}</label>
    <img style={{maxWidth: '200px', display: 'block'}} src={(src || preview) ? getFileURL(src, preview) : ''} />
    <input type="file" accept="image/*" name={name} onChange={onChange} />
  </div>
);

export default ImageField;
