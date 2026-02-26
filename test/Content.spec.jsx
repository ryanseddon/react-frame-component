import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import Content from '../src/Content';

describe('The Content component', () => {
  it('should render children', () => {
    const { container } = render(
      <Content onMount={() => null} onUpdate={() => null}>
        <div className="test-class-1" />
      </Content>
    );

    const div = container.querySelector('div');
    expect(div.className).toBe('test-class-1');
  });

  it('should call onMount on initial render', () => {
    const onMount = vi.fn();
    const onUpdate = vi.fn();

    render(
      <Content onMount={onMount} onUpdate={onUpdate}>
        <div className="test-class-1" />
      </Content>
    );

    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledTimes(0);
  });

  it('should call onUpdate on subsequent updates', async () => {
    const onMount = vi.fn();
    const onUpdate = vi.fn();

    const { rerender } = render(
      <Content onMount={onMount} onUpdate={onUpdate}>
        <div className="test-class-1" />
      </Content>
    );

    expect(onUpdate).toHaveBeenCalledTimes(0);

    rerender(
      <Content onMount={onMount} onUpdate={onUpdate}>
        <div className="test-class-2" />
      </Content>
    );

    await waitFor(() => {
      expect(onMount).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    rerender(
      <Content onMount={onMount} onUpdate={onUpdate}>
        <div className="test-class-3" />
      </Content>
    );

    await waitFor(() => {
      expect(onMount).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledTimes(2);
    });
  });
});
