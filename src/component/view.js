
import React, { Component } from 'react';
import Item from './item';
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

export default View;