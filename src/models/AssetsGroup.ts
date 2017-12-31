class AssetsGroup {
  public raw: Set<string>;
  public inline: Set<string>;
  public sync: Set<string>;
  public async: Set<string>;

  constructor({
    raw = [],
    inline = [],
    sync = [],
    async = []
  }: {
    raw?: Array<string>,
    inline?: Array<string>,
    sync?: Array<string>,
    async?: Array<string>,
  } = {
    raw: [],
    inline: [],
    sync: [],
    async: [],
  }) {
    this.raw = new Set();
    this.inline = new Set();
    this.sync = new Set();
    this.async = new Set();

    raw.forEach((value) => this.raw.add(value));
    inline.forEach((value) => this.inline.add(value));
    sync.forEach((value) => this.sync.add(value));
    async.forEach((value) => this.async.add(value));
  }

  merge(ag: AssetsGroup) {
    ag.raw.forEach((value) => this.raw.add(value));
    ag.inline.forEach((value) => this.inline.add(value));
    ag.sync.forEach((value) => this.sync.add(value));
    ag.async.forEach((value) => this.async.add(value));
  }
}

export {AssetsGroup};
