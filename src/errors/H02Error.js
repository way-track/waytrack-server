
export class H02Error extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class H02CommandError extends H02Error {
  constructor(message) {
    super(message);
    this.message = message;
  }
}
