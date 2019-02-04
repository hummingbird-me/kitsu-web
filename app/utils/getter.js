class Getter {
  constructor(func) {
    this.isDescriptor = true;
    this._getter = func;
  }

  get(obj) {
    return this._getter.call(obj);
  }

  teardown() { } // eslint-disable-line

  setup() { } // eslint-disable-line
}

export default function getter(func) {
  return new Getter(func);
}
