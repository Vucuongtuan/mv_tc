import { useSyncExternalStore } from 'react';

export type SetState<T> = (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => void;
export type GetState<T> = () => T;
export type Subscribe<T> = (listener: (state: T, prevState: T) => void) => () => void;
export type Destroy = () => void;

export interface StoreApi<T> {
  setState: SetState<T>;
  getState: GetState<T>;
  subscribe: Subscribe<T>;
  destroy: Destroy;
}

export type StateCreator<T> = (
  set: SetState<T>,
  get: GetState<T>,
  api: StoreApi<T>
) => T;

export function create<T>(createState: StateCreator<T>) {
  let state: T;
  const listeners = new Set<(state: T, prevState: T) => void>();

  const setState: SetState<T> = (partial, replace) => {
    const nextState = typeof partial === 'function' ? (partial as (state: T) => T | Partial<T>)(state) : partial;

    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace ? nextState : Object.assign({}, state, nextState)) as T;
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState: GetState<T> = () => state;

  const subscribe: Subscribe<T> = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const destroy: Destroy = () => {
    listeners.clear();
  };

  const api = { setState, getState, subscribe, destroy };
  state = createState(setState, getState, api);

  const useStore = (selector: (state: T) => any = (state) => state) => {
    return useSyncExternalStore(
      (callback) => subscribe(() => callback()),
      () => selector(state),
      () => selector(state)
    );
  };

  Object.assign(useStore, api);

  return useStore as any; // Simplified typing for now
}

export default create;
