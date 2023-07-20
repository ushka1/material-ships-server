export class SocketManager {
  private static instance: SocketManager;

  private constructor(io: SocketIO.Server) {
    this.io = io;
  }

  io: SocketIO.Server;

  static init(io: SocketIO.Server): SocketManager {
    this.instance = new this(io);
    return this.instance;
  }

  static getInstance(): SocketManager {
    if (this.instance) {
      return this.instance;
    }

    throw new Error('Socket instance not initialized.');
  }
}
