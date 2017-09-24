import React, { Component } from 'react';
import View from './view';
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
          <div className="remove-store">
            <i className="fa fa-close"></i>
          </div>
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
          </ul>
          <View store={this.state.activeStore} />
        </div>
      )
    }
  }

export default TabBar;