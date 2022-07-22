export class ConfigManager {
  #configs: any[] = [];

  add<T extends any>(c: T) {
    return this.#configs.push(c) - 1;
  }

  get<T extends any>(i: number): T {
    return this.#configs[i];
  }
}

export const configManager = new ConfigManager();
