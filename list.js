/** @jsx React.DOM */
var React = require('react/addons');

// TODO: Generalize the list to a grid. Accept itemsPerRow and calculate squares.
var List = React.createClass({
  propTypes: {
    itemHeight: React.PropTypes.number
  },

  getInitialState: function() {
    return {
      scroll: 0
    };
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },

  render: function() {
    var children = this.props.children;
    var itemKeys = Object.keys(children); // TODO: detect single child.

    var itemHeight = this.props.itemHeight;
    var scrolled = this.state.scroll;
    var viewportHeight = this.state.height || itemHeight * 10;
    var offset = 3;

    var itemsPerPage = Math.round(viewportHeight / itemHeight);
    var topElement = Math.round(scrolled / itemHeight);
    var first = Math.max(topElement - offset * itemsPerPage, 0);
    var last = Math.min(
      Math.max(topElement + itemsPerPage * (1 + offset), topElement + 10),
      itemKeys.length
    );

    var items = [];
    for (i = first; i < last; i++) {
      var child = children[itemKeys[i]];
      child.props.index = i;
      items.push(child);
    }

    // TODO: Make the idb transaction here!

    items = items.map(function(child) {
      return ItemWrapper({
        key: child.props.key || child.props.ref,
        index: child.props.index,
        name: child.props.name,
        height: itemHeight
      }, child);
    });

    this.scrollerStyle.height = itemKeys.length * itemHeight;

    return (
      <div onScroll={this.handleScroll} style={this.style}>
        <div style={this.scrollerStyle}></div>
        {items}
      </div>
    )
  },

  scrollerStyle: {
    opacity: 0,
    top: 0,
    left: 0,
    width: 1
  },

  style: {
    position: 'relative',
    overflow: 'auto',
    width: '100%',
    height: '100%'
  },

  handleScroll: function(event) {
    var scroll = this.getDOMNode().scrollTop;
    var prevScroll = this.state.scroll;
    if (Math.abs(scroll - prevScroll) > 50)
      this.setState({scroll: scroll});
  },

  handleResize: function() {
    var height = this.getDOMNode().clientHeight;
    var width = this.getDOMNode().clientWidth;
    this.setState({height: height, width: width});
  }
});

/*
 * This is wrapped around each item in the list
 */
var ItemWrapper = React.createClass({

  propTypes: {
    key: React.PropTypes.string,
    index: React.PropTypes.number,
    name: React.PropTypes.string
  },

  render: function() {
    var index = this.props.index;
    var name = this.props.name;
    this.style.WebkitTransform = 'translate3d(0, ' + index * 100 + '%, 0)';
    this.style.transform = 'translate3d(0, ' + index * 100 + '%, 0)';
    this.style.height = this.props.height;

    return (
      <div className={name} style={this.style}>
        {this.props.children}
      </div>
    );
  },

  style: {
    position: 'absolute',
    top: 0,
    left: 0,
  }
});

module.exports = List;
