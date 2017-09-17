import React, { Component } from 'react';
/*=============================================
=            SelectBar            =
=============================================*/
class Option extends Component {
    constructor(props) {
      super(props);
      this.option = this.props.option
      this.handleClick = this
        .handleClick
        .bind(this)
    }
    handleClick(e) {
      this
        .props
        .onOptionSelected(this.option)
    }
    render() {
      return (
        <li className="select-option" onClick={this.handleClick}>{this.option}</li>
      )
    }
  }
  
  class Options extends Component {
    render() {
      var options = this.props.options.map((option) => <Option
          option={option}
          onOptionSelected={this.props.onOptionSelected}
          key={option} />)
      if(!this.props.show) {
        return null;
      }
      return (
        <ul className="select-options">
          {options}
        </ul>
      )
    }
  }
  
  class Select extends Component {
    constructor(props) {
      super(props)
      this.handleClick = this.handleClick.bind(this)
    }
    handleClick(e) {
       this.props.onClick(e)
    }
    render() {
      var activeOption = this.props.activeOption
      return (
      <div className="select" onClick={this.handleClick}>
        <div className="select-input">{activeOption}</div>
        <button className="select-button">
        <i className="fa fa-chevron-down fa-lg" aria-hidden="true"></i>
        </button>
      </div>
      )
    }
  }
  
  class SelectBar extends Component {
    constructor(props) {
      super(props)
      this.state = {
        showOptions: false
      }
      this.displayOptions = this.displayOptions.bind(this)
      this.onOptionSelected = this.onOptionSelected.bind(this)
    }
    displayOptions(e) {
      this.setState((prevState, props) => ({
        showOptions: !prevState.showOptions
      }))
    }
    onOptionSelected(option) {
      this.displayOptions();
      this.props.onOptionSelected(option)
    }
    render() {
      return (
        <div className="selectbar">
          <Select activeOption={this.props.activeOption} onClick={this.displayOptions} />
          <Options
            options={this.props.options}
            onOptionSelected={this.onOptionSelected}
            show={this.state.showOptions}
          />
        </div>
      )
    }
  }
  
export default SelectBar;