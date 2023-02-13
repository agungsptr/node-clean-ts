class CustomError implements Error {
  name: string;
  message: string;
  listMessage?: Array<string>;
  stack?: string;

  constructor(name: string, message: string | Array<string>, stack?: string) {
    this.name = name;
    this.stack = stack;
    if (Array.isArray(message)) {
      this.listMessage = message;
      this.message = message.toString();
    } else {
      this.message = message;
    }
  }
}

export default CustomError;
