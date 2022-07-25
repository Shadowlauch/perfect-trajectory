export class ConfigManager {
  #configs: any[] = [];
  #emptyIndexes: number[] = [];

  add<T extends any>(c: T) {
    const emptyIndex = this.#emptyIndexes.shift();
    if (emptyIndex !== undefined) {
      this.#configs[emptyIndex] = c;
      return emptyIndex;
    }
    return this.#configs.push(c) - 1;
  }

  get<T extends any>(i: number): T {
    return this.#configs[i];
  }

  remove(i: number) {
    this.#configs[i] = undefined;
    this.#emptyIndexes.push(i);
  }
}

export const configManager = new ConfigManager();
