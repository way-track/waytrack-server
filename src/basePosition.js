export class BasePosition {
  constructor(device) {
    this.#device(device);
    this.#peerParams(device);
    this.#serverParams();
  }

  #device(device) {
    this.device = {
      device: device
    }
  }

  #serverParams() {
    this.server = {
      timestamp: Date.now(),
    };
  }

  #peerParams(device) {
    this.peer = {
      ip: device.remoteAddress || null,
      port: device.remotePort || null,
    };
  }
}
