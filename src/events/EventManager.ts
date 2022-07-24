export type EventHandler<T> = (e: T) => void;

export interface CollisionEvent {
  first: number;
  second: number;
}

type EventNames = "collision";

type OnType<T extends EventNames> =
  T extends "collision" ? CollisionEvent : never;

export class EventManager {
  #observer: Map<EventNames, Set<any>> = new Map();

  on<T extends EventNames>(eventName: T, cb: EventHandler<OnType<T>>) {
    const prev = this.#observer.get(eventName) ?? new Set();
    this.#observer.set(eventName, prev.add(cb));
  }

  off<T extends EventNames>(eventName: T, cb: EventHandler<OnType<T>>) {
    const prev = this.#observer.get(eventName) ?? new Set();
    prev.delete(cb);
  }

  trigger<T extends EventNames>(eventName: T, event: OnType<T>) {
    const set = this.#observer.get(eventName);
    if (!set) return;
    for (const callback of set) {
      if (!callback) this.off(eventName, callback);
      else callback(event);
    }
  }
}

export const eventManager = new EventManager();
