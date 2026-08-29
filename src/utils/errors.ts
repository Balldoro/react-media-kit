export class ReactMediaKitError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ReactMediaKitError";
  }
}
