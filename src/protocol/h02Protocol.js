/*
 * Copyright Jorge Toro Hoyos (jolthgs@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import protocol from "./h02TcpProtocol.js";
import logger from "../logger.js";
import { decode } from "./h02Decoder.js";

protocol.on("connection", (device) => {
  device.setTimeout(protocol.timeout);

  logger.info(
    `New device connected ${device.remoteAddress}:${device.remotePort}`,
  );

  // decode listeners
  decode(device);

  device.on("data", (chunk) => {
    // [log / debug]
    // logger.info(`${new Date()} [${chunk.length}] "${chunk.toString("ascii")}"`);
    device.emit("decode", chunk);
  });

  device.on("timeout", () => {
    logger.info(`Device ${device.remoteAddress}:${device.remotePort} TIMEOUT`);
    device.end();
  });

  device.on("end", () => {
    logger.info(`Device ${device.remoteAddress}:${device.remotePort} END`);
  });

  device.on("error", (error, chunkString) => {
    logger.error(
      "*******************************************************************",
    );
    logger.error(
      `Device [${device.remoteAddress}:${device.remotePort}], ${error}`,
    );
    logger.error("Chunk:", chunkString);
    logger.error(error.stack);
    logger.error(new Error().stack);
    logger.error(
      "*******************************************************************",
    );
  });
});
