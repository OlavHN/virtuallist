/** @jsx React.DOM */
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var List = require('../dist/list');

window.React = React;

var Example = React.createClass({

  getInitialState: function() {
    return {
      items: ['Hello', 'World'],
      text: ''
    };
  },

  render: function() {
    var items = this.state.items;
    var text = this.state.text;
    /*<List itemHeight={30}>
          {items.map(function(item) {
            return <div key={item}>{item}</div>
          })}
    </List>*/

    return (
      <div>
        <ReactCSSTransitionGroup transitionName="example" component={List} itemHeight={30}>
          {items.map(function(item) {
            return <div key={item}>{item}</div>
          })}
        </ReactCSSTransitionGroup>

        <form onSubmit={this.add}>
          <input placeholder="get milk" type="text" value={text} onChange={this.handleChange} />
        </form>
      </div>
    );
  },

  add: function(event) {
    var text = this.state.text;
    var items = this.state.items.slice();
    items.splice(1, 0, text);
    this.setState({
      items: items,
      text: ''
    });

    return false;
  },

  handleChange: function(event) {
    this.setState({text: event.target.value})
  }
});

React.renderComponent(
  <Example />,
  document.getElementById('content')
);
