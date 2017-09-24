import React, {Component} from 'react';

/*=============================================
=            Stores Manager            =
=============================================*/
class StoreSearch extends Component {
  render() {
    return (
      <div className="store-search" onFocus={this.props.onFocus} onBlur={this.props.onBlur}>
        <input
          type="search"
          name="search"
          placeholder="Add new store..."
          onChange={this.props.onChange}
          autoComplete="off"/>
      </div>
    )
  }
}

class StoreRow extends Component {
  constructor(props) {
    super(props)
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }
  onAdd() {
    this.props.onAdd(this.props.store)
  }
  onRemove() {
    this.props.onRemove(this.props.store)
  }
  render() {
    let addButton = (
      <button 
        className="add button material-icons" 
        onClick={this.onAdd}>done
      </button>
    )
    let removeButton = (
      <button 
        className="remove button material-icons"
        onClick={this.onRemove}
      >done
      </button>
    )
    let button = addButton
    var added = false
    if (this.props.activeStores.indexOf(this.props.store) !== -1) {
      added = true
      button = removeButton
    }
    return (
      <div className="store-row" onClick={added?this.onRemove:this.onAdd}>
        <div className="store">
          {favicon(this.props.store)}
          &nbsp;{this.props.store.name}
        </div>
        {button}
      </div>
    )
  }
}

class FindStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      showList: this.props.showList | false
    }
    this.onChange = this.onChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.hideList = this.hideList.bind(this)
  }
  onFocus(){
    this.setState((prevState) => ({
      showList: true
    }))
  }
  hideList(){
    this.setState((prevState) => ({
      showList: false
    }))
  }
  onChange(e) {
    this.setState({
      query: e.target.value.toLowerCase()
    })
  }
  render() {
    var storesList = this.props.stores.map((store) => {
        if (store.name.toLowerCase().indexOf(this.state.query) !== -1) {
          return <StoreRow
            store={store}
            onAdd={this.props.onAdd}
            onRemove={this.props.onRemove}
            activeStores={this.props.activeStores}/>
        }
        return ""
    })
    var storeListDiv = (
      <div 
        className="store-list"
        onClick={this.onFocus}
        > 
        {storesList}
      </div>
    )
    var closeList = <div className="store-list-close material-icons" onClick={this.hideList}>close</div>
    return (
        <div className="findstore">
          <StoreSearch onChange={this.onChange} onFocus={this.onFocus}/>
          {this.state.showList?storeListDiv:''}
          {this.state.showList?closeList:''}
        </div>
    )
  }
}

export default FindStore;

function favicon(store) {
  var parser = document.createElement('a');
  parser.href = store.url;
  //var loading = <i className="loading fa fa-spinner fa-spin"></i>
  var icon = <img
    className="favicon"
    src={"https://icons.better-idea.org/icon?url=" + parser.hostname + "&size=16..20..200&formats=ico"}
    alt={store.name}/>
  return icon
}
