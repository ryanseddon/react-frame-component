/** @jsx React.DOM */
var React = require('react'),
    Frame = require('./');

var styles = {
  border: '1px solid',
  width: '100%',
  height: '100%'
};

var Header = React.createClass({
  render: function() {
    return <h1>{this.props.children}</h1>;
  }
});

var Content = React.createClass({
  render: function() {
    return <section>{this.props.children}</section>;
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div>
      <Header>Frame example of wrapping application</Header>
      <Content>
      <h2>This whole app is wrapped inside an iFrame</h2>
      </Content>
      </div>
    );
  }
});

React.render(<Frame style={styles}><App /></Frame>, document.querySelector('#example1'));

var Foobar = React.createClass({
  render: function() {
    console.log('this.state.click: %s', this.state.clicked)
    var classes = this.state.clicked ? 'clicked': '';
    return (
      <Frame style={styles} head={
        <style>{'*{color:red}.clicked{color:green}'}</style>
      }>
    <h1 className={classes} onClick={this.handleClick}>Frame example of wrapping component</h1>
    <p>This is also showing encapuslated styles. All text is red inside this component.</p>
    </Frame>
    );
  },
  getInitialState: function() {
    return {
      clicked: false
    }
  },
  handleClick: function() {
    this.setState({
      clicked: !this.state.clicked
    });
  }
});

React.render(<Foobar />, document.querySelector('#example2'));

