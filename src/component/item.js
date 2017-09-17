import React, { Component } from 'react';
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

export default Item;