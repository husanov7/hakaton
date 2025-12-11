import { describe, it, expect, beforeEach } from 'vitest';
import { useOrderStore } from './zustand';

const sampleDish = (id, price = 1000) => ({ _id: String(id), title: `Dish ${id}`, price });

describe('useOrderStore', () => {
  beforeEach(() => {
    useOrderStore.setState({ order: [] });
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it('adds new order with count 1', () => {
    useOrderStore.getState().addOrder(sampleDish(1));
    expect(useOrderStore.getState().order).toEqual([
      { ...sampleDish(1), count: 1 },
    ]);
  });

  it('increments count when adding same dish', () => {
    const { addOrder } = useOrderStore.getState();
    addOrder(sampleDish(1));
    addOrder(sampleDish(1));
    expect(useOrderStore.getState().order[0].count).toBe(2);
  });

  it('removes an item by id', () => {
    const { addOrder, removeOrder } = useOrderStore.getState();
    addOrder(sampleDish(1));
    addOrder(sampleDish(2));
    removeOrder('1');
    expect(useOrderStore.getState().order.map(i => i._id)).toEqual(['2']);
  });

  it('decreaseCount reduces count or removes when hits zero', () => {
    const { addOrder, decreaseCount } = useOrderStore.getState();
    addOrder(sampleDish(1)); // count 1
    addOrder(sampleDish(1)); // count 2
    decreaseCount('1'); // -> 1
    expect(useOrderStore.getState().order[0].count).toBe(1);
    decreaseCount('1'); // -> removed
    expect(useOrderStore.getState().order).toEqual([]);
  });

  it('clearOrder empties the cart', () => {
    const { addOrder, clearOrder } = useOrderStore.getState();
    addOrder(sampleDish(1));
    clearOrder();
    expect(useOrderStore.getState().order).toEqual([]);
  });
});
