import React, {Component} from 'react';
import './App.css';
import SearchBar from './component/searchbar';
import TabBar from './component/tabbar';
import FindStore from './component/findstore.js';

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
    this.showStoreList = this.showStoreList.bind(this)
    /* Categories & Stores */
    this.categories = CATEGORIES
    this.fetchStores()
  }
  componentDidMount(){
    window.addEventListener("scroll", this.onScroll)
  }

  
  /*----------  Fetch Stores Database  ----------*/
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
            activeStores: remoteStores.slice(0, 5),
            stores: remoteStores.slice(1)
          }))
        })
  }

  
  /*----------  Fetch items from Store  ----------*/
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
  /*----------  Categorie ----------*/
  onOptionSelected(option) {
    this.setState({
      activeCategory: option,
    })
  }
  
  /*----------  Search  ----------*/
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
        activeStores[i]['items'] = []
        this.fetchItems(activeStores[i])
      }
      this.setState({
        activeStores: activeStores
      })
    }
  }

  /* Scroll Management */
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

  /* Stores Management */
  addStore(store) {
    var activeStores = this.state.activeStores
    activeStores.push(store)
    this.setState({
      activeStores: activeStores,
      currentSearch: ''
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

  /* Modal Management */
  showStoreList(){
    this.setState({
      showStoreList: true
    })
  }

  /* Rendering */
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
            <FindStore
              stores={this.state.stores}
              activeStores={this.state.activeStores}
              onAdd={this.addStore}
              onRemove={this.removeStore}
              showList={this.state.showStoreList} />
          </div>
        </header>
        <main className="main">
          <TabBar
            activeStores={this.state.activeStores}             
            showStoreList={this.showStoreList}
            />
        </main>
      </div>
    );
  }
}



/*=============================================
=            Data                           =
=============================================*/
var CATEGORIES = [
    'Women',
    'Men',
    'Girls',
    'Boys',
    'Baby'
]



/*=============================================
=           Utils            =
=============================================*/
function get(id, stores) {
  for(var i =0; i < stores.length; i++) {
    if(stores[i].id === id) {
      return stores[i]
    }
  }
}

/*=====  End of Utils  ======*/
export default App;


