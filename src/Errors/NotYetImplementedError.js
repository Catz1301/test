import BaseError from "./base/BaseError.js";

class NotYetImplementedError extends BaseError {
  line;
  method;
  file;

  /** @constructor
   *  @param {int?} line - The line number the error was thrown.
   *  @param {string?} method - The method that threw the error. Highly recommended that this gets a value.
   *  @param {string?} file - The file the error was thrown from.
   */
  constructor(line = null, method = null, file = null) {
    super(null, line, method, file);
    this.message = "This function is not yet implemented!";
    this.name = "NotYetImplementedError";
    // this.line = line;
    this.fullMessage = `${this.name}: ${this.message} | on line ${this.line} from method ${this.method} in file ${this.file}`;
  }
}

export default NotYetImplementedError;
