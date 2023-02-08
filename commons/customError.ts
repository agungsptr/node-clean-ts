class CustomError extends Error {
  list: Array<string>;

  constructor(error: any) {
    super(error);
    this.name = this.constructor.name;
    this.list = error;
  }
}

export default CustomError;
