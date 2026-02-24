import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import Content from '../src/Content';

describe('The Content component', () => {
  it('should render children', () => {
    const { container } = render(
      <Content contentDidMount={() => null} contentDidUpdate={() => null}>
        <div className="test-class-1" />
      </Content>
    );

    const div = container.querySelector('div');
    expect(div.className).toBe('test-class-1');
  });

  it('should call contentDidMount on initial render', () => {
    const didMount = vi.fn();
    const didUpdate = vi.fn();

    render(
      <Content contentDidMount={didMount} contentDidUpdate={didUpdate}>
        <div className="test-class-1" />
      </Content>
    );

    expect(didMount).toHaveBeenCalledTimes(1);
    expect(didUpdate).toHaveBeenCalledTimes(0);
  });

  it('should call contentDidUpdate on subsequent updates', async () => {
    const didMount = vi.fn();
    const didUpdate = vi.fn();

    const { rerender } = render(
      <Content contentDidMount={didMount} contentDidUpdate={didUpdate}>
        <div className="test-class-1" />
      </Content>
    );

    expect(didUpdate).toHaveBeenCalledTimes(0);

    rerender(
      <Content contentDidMount={didMount} contentDidUpdate={didUpdate}>
        <div className="test-class-2" />
      </Content>
    );

    await waitFor(() => {
      expect(didMount).toHaveBeenCalledTimes(1);
      expect(didUpdate).toHaveBeenCalledTimes(1);
    });

    rerender(
      <Content contentDidMount={didMount} contentDidUpdate={didUpdate}>
        <div className="test-class-3" />
      </Content>
    );

    await waitFor(() => {
      expect(didMount).toHaveBeenCalledTimes(1);
      expect(didUpdate).toHaveBeenCalledTimes(2);
    });
  });
});
