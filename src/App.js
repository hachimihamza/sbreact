import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import logo from './img/logo.ico';

/*=============================================
=            Item            =
=============================================*/
class Item extends Component {
  render() {
    var item = this.props.item
    return (
      <div className="item">
        <a href={item.link} className="item-description" target="_blank">
          <div className="item-image">
            <img className="item-img" src={item.img} alt={item.text}/>
          </div>
          <div className="item-price">
            {item.price}
          </div>
          <div className="item-text">  
            {item.text}
          </div>
        </a>
        <div className="item-controls">
          <div className="item-add">
            <i className="fa fa-plus"></i>
          </div>
          <div className="item-link">
            <a href={item.link} className="link" target="_blank">More</a>
          </div>
        </div>
      </div>
    )
  }
}

/*=============================================
=            View            =
=============================================*/
class View extends Component {
  render() {
    var store = this.props.store
    var listItems = store.items.map((item) =>{
      return (
        <Item item={item} id={item.id}  key={item.id}/>
      )
    })
    let loading = "" ;
    if(store.loading === 0) {
      loading = ""
    }
    else {
      loading = "loading"
      if(store.id === 0)  loading = "still-loading"
    } 
    return (
      <div id="view" className={"view " + loading } >
        {listItems}
        <div className="loader"></div>
      </div>
    )
  }
}

/*=============================================
=            Tab            =
=============================================*/
class Tab extends Component {
  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  onClick(event){
    this.props.onClick(this.props.store)
  }
  render() {
    var store = this.props.store
    var isActive = this.props.active;
    
    var parser = document.createElement('a');
    parser.href = this.props.store.url;
    //var loading = <i className="loading fa fa-spinner fa-spin"></i>
    var icon = <img className="favicon" src={ "https://icons.better-idea.org/icon?url="+ parser.hostname +"&size=16..20..200&formats=ico" } alt={store.name}/>
    
    return (
      <a href="#tabbar" className={"tab " + (isActive ? "active" : "")} onClick={this.onClick}>
         {icon} <span className="storename">{store.name}</span>
      </a>
    )
  }
}

/*=============================================
=            TabBar            =
=============================================*/

class TabBar extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeStore : this.props.activeStores[0]
    }
    this.onTabClick = this.onTabClick.bind(this)
  }
  onTabClick(store){
    this.setState({
      activeStore: store
    })
  }
  render() {
    var activeStores = this.props.activeStores
    var listTab = activeStores.map((store) => {
        return <Tab store={store} 
        key={store.id} 
        active={this.state.activeStore === store ? true:false} 
        onClick={this.onTabClick}/>
    })
    return (
      <div id="tabbar" className="tabbar">
        <ul className="tabs">
          {listTab}
          <div className="tab add" onClick={this.props.showSM}>
            <i className="fa fa-plus"></i> Add new store
          </div>
        </ul>
        <View store={this.state.activeStore} />
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
      <form className="searchbar" onSubmit={this.handleSubmit}>          <img className="search-logo" src={logo} alt="logo" />
        <input type="search" className="search-input" name="q" placeholder="search..." onChange={this.handleChange}/>
        <button className="search-button" type="submit">
          <i className="fa fa-search fa-lg" aria-hidden="true"></i>
        </button>
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

/*=============================================
=            Applicaton            =
=============================================*/

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeCategory: 'Women',
      query: '',
      currentSearch: '',
      storesManager: false      
    }

    this.fetchStores = this.fetchStores.bind(this)
    this.onOptionSelected = this.onOptionSelected.bind(this)
    this.onQuery = this.onQuery.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.fetchItems = this.fetchItems.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.addStore = this.addStore.bind(this)
    this.removeStore = this.removeStore.bind(this)
    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    /* Categories & Stores */
    this.categories = CATEGORIES
    this.fetchStores()
  }
  componentDidMount(){
    window.addEventListener("scroll", this.onScroll)
  }
  fetchStores(){
    var request = "api/stores"
    fetch(request)
        .then(function(response){
          return response.json()
        })
        .then((remoteStores) => {
          /* AllStore Special Store */
          let AllStore = {
            id: 0,
            name: 'All',
            favicon: '',
            url: 'http://www.storesbrowser.com',
            items: [],
            loading: 0
          }
          /* Addtional Properties */
          remoteStores.forEach(function(store) {
            store['loading'] = 0
          }, this);

          remoteStores.unshift(AllStore)
          this.setState((prevState) => ({
            activeStores: remoteStores.slice(0, 2),
            stores: remoteStores.slice(1)
          }))
        })
  }
  fetchItems(store) {
    let query = encodeURI(this.state.query)
    let id = store['id']
    let request = `api/search?q=${query}&id=${id}`
    console.log(request)
    fetch(request)
    .then(function(response){
      return response.json()
    })
    .then((items) => {
      let activeStores = this.state.activeStores
      let currentStore = get(store['id'], activeStores)
      let allStore = activeStores[0]
      allStore['items'] = allStore['items'].concat(items.slice(0,20))
      currentStore['items'] = items
      /* Loading Callback */
      currentStore['loading'] = 0
      allStore['loading'] = allStore['loading'] - 1
      this.setState({
        activeStores: activeStores
      })
    })
  }
  onOptionSelected(option) {
    this.setState({
      activeCategory: option,
    })
  }
  onQuery(query) {
    this.setState({
      query: query
    })
  }
  onSearch(){
    if(this.state.query !== "" 
    && this.state.query !== this.state.currentSearch) {
      /*initalize AllStore */
      let activeStores = this.state.activeStores
      let allStore = activeStores[0]
      allStore['items'] = []
      allStore['loading'] = activeStores.length - 1
      this.setState({
        activeStores: activeStores,
        currentSearch: this.state.query
      })
      for(var i=1; i<activeStores.length; i++) {
        activeStores[i]['loading'] = 1
        this.fetchItems(activeStores[i])
      }
      this.setState({
        activeStores: activeStores
      })
    }
  }
  onScroll(e){
    let height = document.querySelector(".header").offsetHeight
    let app = document.querySelector(".app")
    let scrollTop = document.documentElement.scrollTop
    let tabs = document.querySelector('.tabs')
    if(scrollTop > height ) {
      //console.log("scrolled")
      app.classList.add("scrolled")
      tabs.classList.add("fixed")
    } else {
      //console.log("no")
      app.classList.remove("scrolled")
      tabs.classList.remove("fixed")
    }
  }
  addStore(store) {
    var activeStores = this.state.activeStores
    activeStores.push(store)
    this.setState({
      activeStores: activeStores
    })
  }
  removeStore(store){
    var activeStores = this.state.activeStores
    var index = activeStores.indexOf(store)
    activeStores.splice(index, 1)
    this.setState({
      activeStores: activeStores
    })
  }
  showModal(){
    this.setState({
      storesManager: true
    })
  }
  closeModal(){
    this.setState({
      storesManager: false
    })
  }
  render() {
    if(!this.state.activeStores) {
      return null
    }
    //console.log(this.state.activeStores)    
    return (
      <div className="app" onScroll={this.onScroll} >
        <header className="header">
          <div className="topbar">
            <SearchBar
              onQuery={this.onQuery}
              onSearch={this.onSearch}
            />
            <SelectBar
              options={this.categories}
              activeOption={this.state.activeCategory}
              onOptionSelected={this.onOptionSelected} />
          </div>
        </header>
        <main className="main">
          <TabBar
            activeStores={this.state.activeStores} 
            showSM={this.showModal}
            />
        </main>
        <StoreManager
          show={this.state.storesManager} 
          stores={this.state.stores} 
          activeStores={this.state.activeStores} 
          onAdd={this.addStore}
          onRemove={this.removeStore}
          closeModal={this.closeModal}
          />
      </div>
    );
  }
}


/*=============================================
=            Data            =
=============================================*/
var CATEGORIES = [
    'Women',
    'Men',
    'Girls',
    'Boys',
    'Baby'
]


function get(id, stores) {
  for(var i =0; i < stores.length; i++) {
    if(stores[i].id === id) {
      return stores[i]
    }
  }
}

function favicon(store) {
  var parser = document.createElement('a');
  parser.href = store.url;
  //var loading = <i className="loading fa fa-spinner fa-spin"></i>
  var icon = <img className="favicon" src={ "https://icons.better-idea.org/icon?url="+ parser.hostname +"&size=16..20..200&formats=ico" } alt={store.name}/>
  return icon
}
/*
var STORES = [
  {
    id: 0,
    name: "Amazon",
    url: "https://www.amazon.com/",
    items: [
      { 'id': 0,
        'text': 'amazon jean'}
    ]
  }, {
    id: 1,
    name: "ebay",
    url: "https://www.ebay.com/",
    items: [
      { 'id': 1,
        'text': 'ebay jean'}
    ]
  }
]
*/

/*=============================================
=            Stores Manager            =
=============================================*/
class StoreSearch extends Component {
  render(){
    return(
      <div className="store-search">
        <input type="search" name="search" placeholder="Find a store..." onChange={this.props.onChange} autoComplete="off"/>
      </div>
    )
  }
} 

class StoreRow extends Component {
  constructor(props){
    super(props)
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }
  onAdd(){
    this.props.onAdd(this.props.store)
  }
  onRemove(){
    this.props.onRemove(this.props.store)
  }
  render() {
    let add = ( 
      <button className="add button" onClick={this.onAdd}>
        <i className="fa fa-plus"></i> Add
      </button>
    )
    let remove = (
      <button className="remove button" onClick={this.onRemove}>
        <i className="fa fa-minus"></i> Remove
      </button>
    )
    let button = add
    if(this.props.activeStores.indexOf(this.props.store) !== -1) {
      button = remove
    }
    return (
      <div className="store-row">
        <div className="store">
          {favicon(this.props.store)} {this.props.store.name}
        </div>
        <div>
        {button}
        </div>    
      </div>
    )
  }
}

class StoreManager extends Component {
  constructor(props){
    super(props)
    this.state = {
      query: ''
    }
    this.onChange = this.onChange.bind(this)
  }
  onChange(e){
    this.setState({
      query: e.target.value.toLowerCase()
    })
  }
  render() {
    if(!this.props.show){
      return null
    }
    var listRows = this.props.stores.map((store) =>{
        if ( store.name.toLowerCase().indexOf(this.state.query) !== -1){
          return <StoreRow store={store} 
          onAdd={this.props.onAdd}
          onRemove={this.props.onRemove}
          activeStores={this.props.activeStores}
          />          
        }
        return ""
    })
    return (
      <div className="modal">
        <div className="store-manager">
          <button className="close-modal" onClick={this.props.closeModal}>
            <i className="fa fa-close"></i> Close
          </button>
          <StoreSearch onChange={this.onChange} />
          {listRows}
        </div>
      </div>
    )
  }
}


/*=====  End of Stores Manager  ======*/



export default App;


