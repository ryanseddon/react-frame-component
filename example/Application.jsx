import React from 'react';
import ReactDOM from 'react-dom';
import Frame from '../src';

var styles = {
  border: '1px solid',
  width: '100%',
  height: '100%'
};

const Header = ({ children }) => <h1>{this.props.children}</h1>;

const Content = ({ children }) => <section>{this.props.children}</section>

const App = () => (
  <div>
    <Header>Frame example of wrapping application</Header>
    <Content>
      <h2>This whole app is wrapped inside an iFrame</h2>
    </Content>
  </div>
);

ReactDOM.render(<Frame style={styles}><App /></Frame>, document.querySelector('#example1'));

const Foobar = () => (
  <Frame style={styles} head={
    <style>{'*{color:red}'}</style>
  }>
    <h1>Frame example of wrapping component</h1>
    <p>This is also showing encapuslated styles. All text is red inside this component.</p>
  </Frame>
);

ReactDOM.render(<Foobar />, document.querySelector('#example2'));
