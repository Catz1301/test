class BaseError extends Error {
  /** @typedef {Object} BaseErrorOpts
   *  @property {int?} line - The line number the error was thrown on.
   *  @property {string?} method - The method that threw the error.
   *  @property {string?} file - The file the error was thrown from.
   *  @property {object?} extraOpts - Any custom options to be passed to the error.
   */
  line;
  method;
  file;
  extraOpts;

  /** @constructor
   *  @param {BaseErrorOpts?} options A {@link BaseErrorOpts} object containing any information meant to be helpful in the diagnosis of an error.
   *  @param {int?} line - The line number the error was thrown on.
   *  @param {string?} method - The method that threw the error.
   *  @param {string?} file - The file the error was thrown from.
   *  @param {object?} extraOpts - Any custom opt
   */
  constructor(
    options = null,
    line = null,
    method = null,
    file = null,
    extraOpts = null
  ) {
    super();
    if (options != null && typeof options == "object") {
      this.line = options.line;
      this.method = options.method;
      this.file = options.file;
      this.extraOpts = options.extraOpts;
    } else {
      this.line = line;
      this.method = method;
      this.file = file;
      this.extraOpts = extraOpts;
    }
    this.name = "BaseError";
    this.message = "Generic Error Message";
    this.fullMessage = "";
  }

  /** @method
   *  Prints the stack trace of the error (if specified) to console.error
   *  @returns void
   */
  printStackTrace() {
    console.error(this.stack);
  }

  /** @method
   *  Prints the message (or full message, if specified) of the error to console.error
   *  @param {boolean} fullMessage - Flag specifying whether to print the full message or not. False by default.
   *  @returns void
   */
  printFullMessage() {
    console.error(this.fullMessage);
  }

  /** @method
   *  Static method that constructs a new BaseError
   *  @param {BaseErrorOpts} options
   *  @static
   *  @returns BaseError */
  initWithOptions(options) {
    return new this(options);
  }
}

export default BaseError;
