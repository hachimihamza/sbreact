import React, { Component } from 'react';
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
            <StoreSearch onChange={this.onChange} />
            <div className="storelist">
              {listRows}
            </div>
            <button className="close-modal" onClick={this.props.closeModal}>
              <i className="fa fa-close fa-lg"></i> Close
            </button>
          </div>
        </div>
      )
    }
  }

export default StoreManager;

function favicon(store) {
  var parser = document.createElement('a');
  parser.href = store.url;
  //var loading = <i className="loading fa fa-spinner fa-spin"></i>
  var icon = <img className="favicon" src={ "https://icons.better-idea.org/icon?url="+ parser.hostname +"&size=16..20..200&formats=ico" } alt={store.name}/>
  return icon
}
