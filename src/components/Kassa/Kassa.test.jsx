import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Kassa from './Kassa';
import * as store from '../../utils/zustand';

// Helper to seed store
function seedOrder(items) {
  const { useOrderStore } = store;
  useOrderStore.setState({ order: items });
}

describe('Kassa component', () => {
  beforeEach(() => {
    // reset store before each test
    store.useOrderStore.setState({ order: [] });
  });

  it('should render empty message when there are no items', () => {
    render(<Kassa />);
    expect(screen.getByText(/Savatcha bo‘sh/i)).toBeInTheDocument();
  });

  it('should render items and compute total', () => {
    seedOrder([
      { _id: '1', title: 'Lagman', price: 10000, count: 2 },
      { _id: '2', title: 'Somsa', price: 5000, count: 3 },
    ]);
    render(<Kassa />);

    expect(screen.getByText('Lagman')).toBeInTheDocument();
    expect(screen.getByText('Somsa')).toBeInTheDocument();

    // total = 2*10000 + 3*5000 = 35000
    expect(screen.getByText(/Umumiy: 35,000 so‘m|Umumiy: 35\,000 so‘m/)).toBeInTheDocument();
  });

  it('should call decreaseCount on minus button', () => {
    const spy = vi.spyOn(store.useOrderStore.getState(), 'decreaseCount');
    seedOrder([{ _id: '1', title: 'Lagman', price: 10000, count: 2 }]);

    render(<Kassa />);

    const minusBtn = screen.getByRole('button', { name: '–' });
    fireEvent.click(minusBtn);

    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should call removeOrder on delete button', () => {
    const spy = vi.spyOn(store.useOrderStore.getState(), 'removeOrder');
    seedOrder([{ _id: '1', title: 'Lagman', price: 10000, count: 2 }]);

    render(<Kassa />);

    const delBtn = screen.getByRole('button', { name: '❌' });
    fireEvent.click(delBtn);

    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should clear order when clicking Tozalash', () => {
    const spy = vi.spyOn(store.useOrderStore.getState(), 'clearOrder');
    seedOrder([{ _id: '1', title: 'Lagman', price: 10000, count: 2 }]);

    render(<Kassa />);

    const clearBtn = screen.getByRole('button', { name: /Tozalash/i });
    fireEvent.click(clearBtn);

    expect(spy).toHaveBeenCalled();
  });
});
