import React from 'react';
import ReactDOM from 'react-dom';
import Frame from '../src';

const styles = {
  border: '1px solid',
  width: '100%',
  height: '100%'
};

const Header = ({ children }) => <h1>{children}</h1>;

const Content = ({ children }) => <section>{children}</section>;

const App = () => (
  <div>
    <Header>Frame example of wrapping application</Header>
    <Content>
      <h2>This whole app is wrapped inside an iFrame</h2>
    </Content>
  </div>
);

ReactDOM.render(
  <Frame style={styles}>
    <App />
  </Frame>,
  document.querySelector('#example1')
);

const Foobar = () => {
  const [toggle, updateToggle] = React.useState(false);
  return (
    <Frame style={styles} head={<style>{'*{color:red}'}</style>}>
      <h1>Frame example of wrapping component</h1>
      <p>
        This is also showing encapuslated styles. All text is red inside this
        component.
      </p>
      {toggle && <h2>Hello</h2>}
      <button onClick={() => updateToggle(!toggle)}>Toggle</button>
    </Frame>
  );
};

ReactDOM.render(<Foobar />, document.querySelector('#example2'));

const ExternalResources = () => {
  const initialContent = `<!DOCTYPE html><html><head>
	<link href="//use.fontawesome.com/releases/v5.15.1/css/all.css" rel="stylesheet" />
	<link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700" rel="stylesheet" type="text/css" />
	<base target=_blank>
  </head><body style='overflow: hidden'><div></div></body></html>`;

  return (
    <Frame initialContent={initialContent}>
      <h1>External Resources</h1>
      <p>
        This tests loading external resources via initialContent which can
        create timing issues with onLoad and srcdoc in cached situations
      </p>
    </Frame>
  );
};

ReactDOM.render(<ExternalResources />, document.querySelector('#example3'));
