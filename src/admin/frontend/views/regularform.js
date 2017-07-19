import React, {
  Component
} from 'react'
import AlertContainer from 'react-alert'
import fetch from 'isomorphic-fetch'
import nconf from 'nconf';


class RegularForm extends React.Component {

  constructor(props) {

      super(props);
      var original = "Choose Here";

      this.disabledOptions = false;
      var saved = true;
      this.state = {
          name: "",
          markdown: "",
          allData: [],
          html: "",
          dropDownDisabled: false,
          dropDownValue: "",

      };
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleInputChangeText = this.handleInputChangeText.bind(this);
      this.deleteData = this.deleteData.bind(this);
      this.handleDropDownChange = this.handleDropDownChange.bind(this);
      this.discardChanges = this.discardChanges.bind(this);
      this.createMarkup = this.createMarkup.bind(this);
  };

  deleteData(event) {
      var self = this;
      var url = nconf.get('SERVER_ROOT') +'admin/deleteData';
      fetch(url);
      self.setState({
          allData: []
      })
  }




  handleDropDownChange(event) {

    var prev = this.state.dropDownValue;
    var clickedValue =  event.target.value
      if (this.original != this.state.markdown) {
        document.getElementById("alert-message").style.display = 'block';
        this.setState({
        dropDownValue : prev
        })
      } else {
          var self = this;
          var url = nconf.get('SERVER_ROOT') + 'admin/getStaticContent/' + clickedValue
          fetch(url)
              .then(function(response) {
                  return response.json();
              })
              .then(function(data) {

                  self.setState({
                      name: data.name,
                      markdown: data.contentMD,
                      dropDownValue: clickedValue
                  });

              }).then(function() {
                  self.original = self.state.markdown;
                  console.log(self.original + 'after it fetches');
              });
      }
  }



  handleInputChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
      event.preventDefault();
  }



  handleInputChangeText(event) {

      const target = event.target;
      const value = target.value;
      const name = target.name;
      var showdown = require('showdown'),
          converter = new showdown.Converter(),
          html = converter.makeHtml(value);

      this.setState({
          [name]: value,
          html: html
      }, function() {
          if (this.original != this.state.markdown) {
              this.setState({
                  dropDownDisabled: true
              })
          } else {
              this.setState({
                  dropDownDisabled: false
              })
          }
      });
      event.preventDefault();



  }



  discardChanges(event) {
      this.setState({
          markdown: this.original
      });
      event.preventDefault();
  }



  componentWillMount() {
      this.original = "";
      var self = this;
      var url = nconf.get('SERVER_ROOT') + 'admin/data';
      var myHeaders = new Headers();
  var request = new Request(url, {
  	headers: new Headers({
  		'Content-Type': 'application/json'
  	})
  });

      fetch(url)
          .then(function(response) {
            console.log(response);

              return response.json();
          })
          .then(function(data) {

              self.setState({
                  allData: data
              })
          });
  }

   createMarkup() {
    var innerhtml = {__html: this.state.html}
    return innerhtml;
  }


  render() {

   return (
     <div id = "regularform">
       <div id= "left-container">
         <form  action='/admin'method="post">



  <div id ="alert-message" style={{display: 'none'}} className="alert alert-danger">
    Submit your changes or discard them before switching.
  </div>

   <div className="dropdown">
       <select id="dropdown" onChange={this.handleDropDownChange} value={this.state.dropDownValue}>
           <option selected disabled>Choose here</option>
         {this.state.allData.map((datum, i) => {
       return <option >{datum.name}</option>;
     })}
       </select>
     </div>

       <br />
          <label>
         Names
       </label>
         <input
           name="name"
           type="text"
           value={this.state.name}
           onChange={this.handleInputChange} />
           <br />
           <label>
             Text
           </label>
       <br />


         <textarea  className = "textareaform"name ="markdown" value={this.state.markdown} onChange={this.handleInputChangeText} />
           <input
             name="html"
             type ="hidden"
             value={this.state.html}/>
               <br/>
             <button type= "button" onClick={this.discardChanges}>
               Discard changes
           </button>

 <input id="submit" type="submit" value="Save" />

 </form>
 </div>
<div> Preview</div>
 <div className="tile tile-vertical white-theme container-right">
 <div dangerouslySetInnerHTML={this.createMarkup()} /></div>
</div>




   );
 }
}
export default RegularForm;
