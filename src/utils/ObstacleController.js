const createKey = (key, id) => `${key}-${id}`;

export default class ObstaleController {
  constructor() {
    this.obstacles = new Map();
  }

  add(name, body) {
    const key = createKey(name, body.id);
    if (this.obstacles.has(key)) {
      throw new Error('Already has that key');
    }
    this.obstacles.set(key, body);
  }

  is(name, body) {
    const key = createKey(name, body.id);
    return this.obstacles.has(key);
  }
}
