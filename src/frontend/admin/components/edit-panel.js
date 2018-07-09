import React, {Component} from 'react';

export default class EditPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._handleChange = this.handleChange.bind(this);
    this._handleImageChange = this.handleImageChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleImageChange(e) {
    const file = e.target.files[0];
    const blob = file ? URL.createObjectURL(file) : '';

    const previewName = `${e.target.name}_preview_img`;
    const bufferName = `${e.target.name}_buffer`;

    this.setState({
      [previewName]: blob,
    });

    const reader = new FileReader();
    reader.onload = () => this.setState({
      [bufferName]: reader.result,
    });
    reader.readAsDataURL(file);
  }

  getChanges() {
    return Object.keys(this.state)
      .filter(key => this.editableFields.includes(key))
      .reduce((obj, key) => Object.assign(obj, { [key]: this.state[key] }), {});
  }

  hasChanges() {
    return Object.keys(this.getChanges()).length > 0;
  }
};
