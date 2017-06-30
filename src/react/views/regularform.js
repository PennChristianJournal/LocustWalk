import React, {Component} from 'react';
// import StaticContent from '../../models/StaticContent';

class RegularForm extends React.Component {

  constructor(props) {
     super(props);
     this.state = {
      name: "d",
      markdown: "s",
      html: "s",


    };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.findStatic = this.findStatic.bind(this);

     };

     handleInputChange(event) {
         const target = event.target;
         const value = target.value;
         const name = target.name;

         this.setState({
           [name]: value
         });
         event.preventDefault();
       }


 findStatic(e){
   e.preventDefault();

// var x = StaticFile.findOne({});
console.log("ASADSASDASDD");
console.log('ASd');
  }

  render() {
    return (
      <form action='/admin'method="post">
        <select name = "dropdown" value={this.state.value} onChange={this.handleInputChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        <label>
          Name
          <input
            name="name"
            type="text"
            value={this.state.name}
            onChange={this.handleInputChange} />
        </label>
        <br />


        <br />
        <label>
          Text
          <textarea name = "markdown" value={this.state.markdown} onChange={this.handleInputChange} />

          <input
            name="html"
            type="text"
            hidden = "true"
            value={this.state.html}
            onChange={this.handleInputChange} />
        </label>
          <input type="submit" value="Submit" />
            <button type= "button" onClick={this.findStatic}>
      Activate Lasers
    </button>

      </form>
    );
  }
}
export default RegularForm;
