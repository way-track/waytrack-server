export class BasePosition {
  constructor(device) {
    this.#device(device);
    this.#peer(device);
    this.#server();
  }

  #device(device) {
    this.device = {
      device: device,
    };
  }

  #server() {
    this.server = {
      timestamp: Date.now(),
    };
  }

  #peer(device) {
    this.peer = {
      ip: device.remoteAddress || null,
      port: device.remotePort || null,
    };
  }
}
