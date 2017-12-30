class AssetsGroup {
  public raw: Array<string>;
  public inline: Array<string>;
  public sync: Array<string>;
  public async: Array<string>;

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
    this.raw = raw;
    this.inline = inline;
    this.sync = sync;
    this.async = async;
  }

  merge(ag: AssetsGroup) {
    this.raw = this.raw.concat(ag.raw);
    this.inline = this.inline.concat(ag.inline);
    this.sync = this.sync.concat(ag.sync);
    this.async = this.async.concat(ag.async);
  }
}

export {AssetsGroup};
