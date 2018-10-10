class OrderedSet<T> {

  private orderedSet: Set<string>;
  private vals: {
    [key: string]: T
  };

  constructor() {
    this.orderedSet = new Set<string>();
    this.vals = {};
  }

  add(key: string, value: T) {
    if (this.orderedSet.has(key)) {
      return;
    }

    this.orderedSet.add(key);
    this.vals[key] = value;
  }

  prepend(key: string, value: T) {
    if (this.orderedSet.has(key)) {
      return;
    }

    const newSet = new Set<string>();
    newSet.add(key);
    for (const k of Array.from(this.orderedSet)) {
      newSet.add(k);
    }

    this.orderedSet = newSet;
    this.vals[key] = value;
  }

  addSet(newSet: OrderedSet<T>) {
    for (const v of newSet.data()) {
      this.add(v.path, v.value);
    }
  }

  data(): Array<{path: string, value: T}> {
    const paths: Array<{path: string, value: T}> = [];
    for (const key of this.orderedSet.values()) {
      paths.push({
        path: key,
        value: this.vals[key],
      });
    }
    return paths;
  }

  values(): T[] {
    const values: T[] = [];
    for (const key of this.orderedSet.values()) {
      values.push(this.vals[key]);
    }
    return values;
  }
}

export {OrderedSet};