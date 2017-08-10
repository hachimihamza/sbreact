import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';

/*=============================================
=            WebViews            =
=============================================*/

class WebView extends Component {
  render() {
    var activeUrl = this.props.store.activeUrl
    var isActive = this.props.active
    return (
      <div className={"webview " + (isActive
        ? "active"
        : "")}>
        {activeUrl}
      </div>
    )
  }
}

class WebViews extends Component {
  render() {
    var listView = this.props.stores.map((store) =>{
      var active = false
      if(this.props.activeStore.name === store.name) {
        active = true
      }
      return <WebView store={store} key={store.name} active={active}/>
    })
    return (
      <div className="webviews">
        {listView}
      </div>
    )
  }
}

/*=============================================
=            StoreBar            =
=============================================*/
class StoreTab extends Component {
  constructor(props){
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.store = this.props.store
  }
  handleClick(e){
    this.props.onStoreSelected(this.store)
  }
  render() {
    var store = this.props.store
    var isActive = this.props.active;
    return (
      <li className={"tab " + (isActive ? "active" : "")} onClick={this.handleClick}>
        {store.name}
      </li>
    )
  }
}

class StoreBar extends Component {
  render() {
    var listTab = this.props.stores.map((store) => {
      var active = false
      if(this.props.activeStore.name === store.name) {
        active = true
      }
      return <StoreTab store={store} key={store.name} active={active} onStoreSelected={this.props.onStoreSelected}/>
    })
    return (
      <ul>
        {listTab}
      </ul>
    )
  }
}

/*=============================================
=            MainView            =
=============================================*/
class MainView extends Component {
  render() {
    return (
      <div className="mainview">
        <StoreBar stores={this.props.stores} activeStore={this.props.activeStore} onStoreSelected={this.props.onStoreSelected}/>
        <WebViews stores={this.props.stores} activeStore={this.props.activeStore} />
      </div>
    )
  }
}

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
      <form className="SearchBar" onSubmit={this.handleSubmit}>
        <input type="search" name="q" placeholder="search..." onChange={this.handleChange}/>
      </form>
    )
  }
}

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
      <li onClick={this.handleClick}>{this.option}</li>
    )
  }
}

class Options extends Component {
  render() {
    var options = this
      .props
      .options
      .map((option) => <Option
        option={option}
        onOptionSelected={this.props.onOptionSelected}
        key={option}/>)
    return (
      <ul className="options">
        {options}
      </ul>
    )
  }
}

class Select extends Component {
  render() {
    var activeOption = this.props.activeOption
    return (
      <div className="select">
        {activeOption}
      </div>
    )
  }
}

class SelectBar extends Component {
  render() {
    return (
      <div className="selectbar">
        <Select activeOption={this.props.activeOption}/>
        <Options
          options={this.props.options}
          onOptionSelected={this.props.onOptionSelected}/>
      </div>
    )
  }
}

/*=============================================
=            Applicaton            =
=============================================*/

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      activeCategory: 'General',
    }
    this.fetchData()

    this.onOptionSelected = this.onOptionSelected.bind(this)
    this.onStoreSelected = this.onStoreSelected.bind(this)
    this.onQuery = this.onQuery.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  fetchData(){
    var request = "/api/categories/"
    var stores = {}
    fetch(request)
        .then(function(response){
          return response.json()
        })
        .then((data) => {
          data.forEach((category) => {
            category.stores.forEach((store)=>{
              store.activeUrl = store.url
            })
            stores[category.name] = category.stores
          })
        this.setState((prevState) => ({
          stores: stores,
          categories: Object.keys(stores),
          activeStores: stores[prevState.activeCategory],
          activeStore: stores[prevState.activeCategory][0],
        }))
      })
  }
  onOptionSelected(option) {
    this.setState((prevState) =>({
      activeCategory: option,
      activeStores: prevState.stores[option],
      activeStore: prevState.stores[option][0]
    }))
  }
  onStoreSelected(store) {
    this.setState({
      activeStore: store
    })
  }
  onQuery(query) {
    this.setState({
      query: query
    })
  }
  onSearch(){
    var activeStores = this.state.activeStores
    activeStores.forEach((store)=>{
      store.activeUrl = store.search + this.state.query
    })
    this.setState({
      activeStores: activeStores
    })
  }
  render() {
    if(!this.state.stores) {
      return null
    }
    var activeStores = this.state.activeStores
    var activeStore = this.state.activeStore
    return (
      <div className="App">
        <header>
          <SearchBar
            onQuery={this.onQuery}
            onSearch={this.onSearch}
          />
          <SelectBar
            options={this.state.categories}
            activeOption={this.state.activeCategory}
            onOptionSelected={this.onOptionSelected}/>
        </header>
        <MainView stores={activeStores} activeStore={activeStore} onStoreSelected={this.onStoreSelected}/>
      </div>
    );
  }
}

/*
var CATEGORIES = ["General", "Clothing"]

var STORES = [
  {
    name: "Amazon",
    url: "https://www.amazon.com/",
    isActive: true
  }, {
    name: "ebay",
    url: "https://www.ebay.com/",
    isActive: false
  }
]
*/
export default App;
