import React, { Component } from 'react';
import logo from '../img/logo.ico';
/*=============================================
=            SearchBar            =
=============================================*/
class SearchBar extends Component {
    constructor(props){
      super(props)
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(e) {
      e.preventDefault()
      this.props.onSearch(e)
    }
    handleChange(e) {
      this.props.onQuery(e.target.value)
    }
    render() {
      return (
        <form className="searchbar" onSubmit={this.handleSubmit}>          <img className="search-logo" src={logo} alt="logo" />
          <input type="search" className="search-input" name="q" placeholder="search..." onChange={this.handleChange}/>
          <button className="search-button" type="submit">
            <i className="fa fa-search fa-lg" aria-hidden="true"></i>
          </button>
        </form>
      )
    }
  }

export default SearchBar;