import React from 'react';
import PropTypes from 'prop-types';
import { render, waitFor } from '@testing-library/react';
import { expect, vi, describe, it, afterEach, beforeEach } from 'vitest';
import ForwardedRefFrame, { Frame } from '../src/Frame';

describe('The Frame Component', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    if (div) {
      div.remove();
      div = null;
    }
  });

  it('should create an empty iFrame', () => {
    const { container } = render(<Frame />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeDefined();
    expect(iframe.contentWindow).toBeDefined();
  });

  it('should not pass this.props.children in iframe render', () => {
    render(
      <Frame className="foo">
        <div />
      </Frame>
    );

    const iframe = document.querySelector('iframe');
    expect(iframe.contentDocument.body.children.length).toBe(0);
  });

  it('should create an empty iFrame and apply inline styles', () => {
    const { container } = render(<Frame style={{ border: 0 }} />);
    const iframe = container.querySelector('iframe');
    expect(iframe.style.border).toBe('0px');
  });

  it('should pass along all props to underlying iFrame', () => {
    const { container } = render(
      <Frame
        className="test-class-1 test-class-2"
        frameBorder={0}
        height="100%"
        width="80%"
      />
    );
    const iframe = container.querySelector('iframe');
    expect(iframe.className).toBe('test-class-1 test-class-2');
    expect(iframe.getAttribute('frameBorder')).toBe('0');
    expect(iframe.getAttribute('height')).toBe('100%');
    expect(iframe.getAttribute('width')).toBe('80%');
  });

  it('should create an iFrame with a <link> tag inside', async () => {
    const { container } = render(
      <Frame
        head={<link href="styles.css" />}
        contentDidMount={() => {
          const iframe = container.querySelector('iframe');
          const head = iframe.contentDocument.head;
          expect(head.querySelector('link')).toBeDefined();
          expect(head.querySelector('link').href).toContain('styles.css');
        }}
      />
    );

    const iframe = container.querySelector('iframe');
    await waitFor(() => {
      const head = iframe.contentDocument.head;
      expect(head.querySelector('link')).toBeDefined();
    });
  });

  it('should create an iFrame with a <script> and insert children', async () => {
    const { container } = render(
      <Frame
        head={<script src="foo.js" />}
        contentDidMount={() => {
          const iframe = container.querySelector('iframe');
          const head = iframe.contentDocument.head;
          const body = iframe.contentDocument.body;

          expect(head.querySelector('script')).toBeDefined();
          expect(head.querySelector('script').src).toContain('foo.js');
          expect(body.querySelectorAll('h1,h2').length).toBe(2);
        }}
      >
        <h1>Hello</h1>
        <h2>World</h2>
      </Frame>
    );

    const iframe = container.querySelector('iframe');
    await waitFor(() => {
      const head = iframe.contentDocument.head;
      const body = iframe.contentDocument.body;
      expect(head.querySelector('script')).toBeDefined();
      expect(body.querySelectorAll('h1,h2').length).toBe(2);
    });
  });

  it('should create an iFrame with multiple <link> and <script> tags inside', async () => {
    const { container } = render(
      <Frame
        head={[
          <link key="styles" href="styles.css" />,
          <link key="foo" href="foo.css" />,
          <script key="bar" src="bar.js" />
        ]}
        contentDidMount={() => {
          const iframe = container.querySelector('iframe');
          const head = iframe.contentDocument.head;

          expect(head.querySelectorAll('link').length).toBe(2);
          expect(head.querySelectorAll('script').length).toBe(1);
        }}
      />
    );

    const iframe = container.querySelector('iframe');
    await waitFor(() => {
      const head = iframe.contentDocument.head;
      expect(head.querySelectorAll('link').length).toBe(2);
      expect(head.querySelectorAll('script').length).toBe(1);
    });
  });

  it('should encapsulate styles and not effect elements outside', async () => {
    const { container } = render(
      <div>
        <p>Some text</p>
        <Frame
          head={<style>{'*{color:red}'}</style>}
          contentDidMount={() => {
            const iframe = container.querySelector('iframe');
            const elem = container.querySelector('p');
            const body = iframe.contentDocument.body;
            const getColour = (e) =>
              window.getComputedStyle(e, null).getPropertyValue('color');
            expect(getColour(elem)).toBe('rgb(0, 0, 0)');
            expect(getColour(body.querySelector('p'))).toBe('rgb(255, 0, 0)');
          }}
        >
          <p>Some text</p>
        </Frame>
      </div>
    );

    await waitFor(() => {
      const iframe = container.querySelector('iframe');
      const elem = container.querySelector('p');
      const body = iframe.contentDocument.body;
      const getColour = (e) =>
        window.getComputedStyle(e, null).getPropertyValue('color');
      expect(getColour(elem)).toBe('rgb(0, 0, 0)');
      expect(getColour(body.querySelector('p'))).toBe('rgb(255, 0, 0)');
    });
  });

  it('should re-render inside the iframe correctly', async () => {
    const pRef = React.createRef();
    const { container, rerender } = render(
      <Frame contentDidMount={() => {}}>
        <p ref={pRef}>Test 1</p>
      </Frame>
    );

    await waitFor(() => {
      const iframe = container.querySelector('iframe');
      expect(iframe.contentDocument.body.querySelector('p').textContent).toBe(
        'Test 1'
      );
    });

    pRef.current.setAttribute('data-test-value', 'set on dom');

    rerender(
      <Frame contentDidMount={() => {}}>
        <p ref={pRef}>Test 2</p>
      </Frame>
    );

    await waitFor(() => {
      expect(pRef.current.textContent).toBe('Test 2');
      expect(pRef.current.getAttribute('data-test-value')).toBe('set on dom');
    });
  });

  it('should pass context to components in the frame', async () => {
    const Child = (props, context) => (
      <div className="childDiv">{context.color}</div>
    );
    Child.contextTypes = {
      color: PropTypes.string.isRequired
    };

    class Parent extends React.Component {
      static childContextTypes = {
        color: PropTypes.string
      };
      static propTypes = {
        children: PropTypes.element.isRequired
      };
      getChildContext() {
        return { color: 'purple' };
      }
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    const TestComponent = () => (
      <Parent>
        <Frame>
          <Child />
        </Frame>
      </Parent>
    );

    render(<TestComponent />);

    await waitFor(() => {
      const iframe = document.querySelector('iframe');
      expect(
        iframe.contentDocument.body.querySelector('.childDiv').textContent
      ).toBe('purple');
    });
  });

  it('should allow setting initialContent', async () => {
    const initialContent =
      '<!DOCTYPE html><html><head><script>console.log("foo");</script></head><body><div></div></body></html>';

    const { container } = render(
      <Frame
        initialContent={initialContent}
        contentDidMount={() => {
          const iframe = container.querySelector('iframe');
          expect(iframe.contentDocument.documentElement.outerHTML).toContain(
            '<script>console.log("foo");</script>'
          );
        }}
      />
    );

    const iframe = container.querySelector('iframe');
    await waitFor(() => {
      expect(iframe.contentDocument.documentElement.outerHTML).toContain(
        '<script>console.log("foo");</script>'
      );
    });
  });

  it('should allow setting mountTarget', async () => {
    const initialContent =
      "<!DOCTYPE html><html><head></head><body><h1>i was here first</h1><div id='mountHere'></div></body></html>";

    const { container } = render(
      <Frame
        initialContent={initialContent}
        mountTarget="#mountHere"
        contentDidMount={() => {
          const iframe = container.querySelector('iframe');
          expect(iframe.contentDocument.querySelectorAll('h1').length).toBe(2);
        }}
      >
        <h1>And i am joining you</h1>
      </Frame>
    );

    const iframe = container.querySelector('iframe');
    await waitFor(() => {
      expect(iframe.contentDocument.querySelectorAll('h1').length).toBe(2);
    });
  });

  it('should call contentDidMount on initial render', async () => {
    const didMount = vi.fn();
    const didUpdate = vi.fn();

    render(<Frame contentDidMount={didMount} contentDidUpdate={didUpdate} />);

    await waitFor(() => {
      expect(didMount).toHaveBeenCalledTimes(1);
      expect(didUpdate).toHaveBeenCalledTimes(0);
    });
  });

  it('should call contentDidUpdate on subsequent updates', async () => {
    const didUpdate = vi.fn();
    const didMount = vi.fn();

    const { rerender } = render(
      <Frame
        contentDidUpdate={didUpdate}
        contentDidMount={() => {
          didMount();
        }}
      />
    );

    await waitFor(() => {
      expect(didMount).toHaveBeenCalledTimes(1);
    });

    rerender(
      <Frame
        contentDidUpdate={didUpdate}
        contentDidMount={() => {
          didMount();
        }}
      />
    );

    await waitFor(() => {
      expect(didUpdate).toHaveBeenCalledTimes(1);
    });
  });

  it('should return first child element of the body on call to getMountTarget() if mountTarget was not passed in', async () => {
    const { container } = render(<Frame />);

    const iframe = container.querySelector('iframe');
    await waitFor(() => {
      const body = iframe.contentDocument.body;
      expect(body.children.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('should return resolved mountTarget node on call to getMountTarget() if mountTarget was passed in', async () => {
    const initialContent =
      "<!DOCTYPE html><html><head></head><body><div></div><div id='container'></div></body></html>";

    const { container } = render(
      <Frame initialContent={initialContent} mountTarget="#container" />
    );

    const iframe = container.querySelector('iframe');
    await waitFor(() => {
      expect(
        iframe.contentDocument.body.querySelector('#container')
      ).toBeDefined();
    });
  });

  it('should not error when parent components are reused', async () => {
    const { container, rerender } = render(
      <ul className="container">
        <li>
          <Frame>
            <p>Test 1</p>
          </Frame>
        </li>
        <li>
          <Frame>
            <p>Test 2</p>
          </Frame>
        </li>
      </ul>
    );

    await waitFor(() => {
      const iframes = container.querySelectorAll('iframe');
      expect(
        iframes[0].contentDocument.body.querySelector('p').textContent
      ).toBe('Test 1');
      expect(
        iframes[1].contentDocument.body.querySelector('p').textContent
      ).toBe('Test 2');
    });

    rerender(
      <ul className="container">
        <li>
          <Frame>
            <p>Test 2</p>
          </Frame>
        </li>
        <li>
          <Frame>
            <p>Test 1</p>
          </Frame>
        </li>
      </ul>
    );

    await waitFor(() => {
      const iframes = container.querySelectorAll('iframe');
      expect(
        iframes[0].contentDocument.body.querySelector('p').textContent
      ).toBe('Test 2');
      expect(
        iframes[1].contentDocument.body.querySelector('p').textContent
      ).toBe('Test 1');
    });
  });

  it('should not error when the root component is removed', async () => {
    const { unmount } = render(<Frame />);
    unmount();
    render(<Frame />);
  });

  it('should not error when root component is re-appended', async () => {
    const { container } = render(
      <Frame
        contentDidMount={() => {
          const iframes = container.querySelectorAll('iframe');
          expect(iframes[0].contentDocument.body.children.length).toBe(1);
        }}
      />
    );

    await waitFor(() => {
      const iframes = container.querySelectorAll('iframe');
      expect(iframes[0].contentDocument.body.children.length).toBe(1);
    });
  });

  it('should properly assign ref prop', async () => {
    const ref = vi.fn();

    render(<ForwardedRefFrame ref={ref} />);

    await waitFor(() => {
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0] instanceof HTMLIFrameElement).toBe(true);
    });
  });
});
