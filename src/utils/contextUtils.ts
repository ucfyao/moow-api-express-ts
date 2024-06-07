type ContextOptions = (u: Context) => void;

class Context {
  reqId: string;
  userId: string;
  session: string;

  constructor(...options: ContextOptions[]) {
    this.reqId = "";
    this.userId = "";
    this.session = "";

    for (const option of options) {
      option(this);
    }
  }

  public static withUserId(userId: string) {
    return (ctx: Context): void => {
        ctx.userId = userId;
    };
  }

  public static withReqId(reqId: string) {
    return (ctx: Context): void => {
        ctx.reqId = reqId;
    };
  }
}

export default Context;
