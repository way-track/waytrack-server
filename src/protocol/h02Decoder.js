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
import { H02CommandError } from "../errors/H02Error.js";
import { bufferToBufferArray } from "../utils/buffer.js";
import { Position } from "./h02Position.js";

const separatorByte = 0x2c; // Comma ","

const HTBT = ["header", "id", "command"];
const TIME = ["header", "id", "command"];
const V0 = ["header", "id", "command"];
const ICCID = ["header", "id", "command", "simSerial"];
// const HTBT_BAT = ["header", "ide", "command", "battery"];
const V1 = [
  "header",
  "id",
  "command",
  "time",
  "valid",
  "lat",
  "latSymbol",
  "lon",
  "lonSymbol",
  "speed",
  "direction",
  "date",
  "status",
];

const PATTERNS = {
  V0,
  HTBT,
  ICCID,
  TIME,
  // HTBT_BAT,
  V1,
};

/*
 * return the type of command: V1, HTBT, etc.
 */
const typeOfCommand = (arrayBuf) => {
  const command = arrayBuf[2];
  if (!command)
    throw new H02CommandError("buffer H02 protocol. Command not found!");
  return command;
};

/*
 * return a JSON of patterns.
 */
const patterned = (arrayBuf, patterns = PATTERNS) => {
  const cmd = typeOfCommand(arrayBuf);
  const pattern = patterns[cmd];

  return Object.fromEntries(
    arrayBuf.map((value, index) => [pattern[index], value.toString("ascii")]),
    // arrayBuf.map((value, index) => [pattern[index], value]),
  );
};

/*
 * DECODE
 */
export const decode = (device) => {
  device.on("decode", (buffer) => device.emit("parse", buffer));

  device.on("parse", (buffer) => {
    const typeOfBuffer = {
      // V1: (buffer, arrayBuf) => device.emit("v1", buffer, arrayBuf),
      V1: (buffer, patternJSON) => device.emit("v1", buffer, patternJSON),
      // HTBT: (buffer) => device.emit("htbt", buffer),
      HTBT: (buffer) => device.emit("response", buffer),
      V0: (buffer) => device.emit("response", buffer),
      TIME: () => {}, // don't implemented
      ICCID: () => {}, // don't implemented
    };

    try {
      const arrayBuf = bufferToBufferArray(buffer, separatorByte);
      // const typeBuf = typeOfBuffer[typeOfCommand(arrayBuf)];
      // typeBuf(buffer, arrayBuf);
      const patternJSON = patterned(arrayBuf, PATTERNS);
      const typeBuf = typeOfBuffer[patternJSON.command];
      // typeBuf(buffer, arrayBuf);
      typeBuf(buffer, patternJSON);
    } catch (error) {
      if (error instanceof TypeError) {
        device.emit(
          "error",
          new H02CommandError(error.message),
          buffer.toString(),
        );
      }
      if (error instanceof H02CommandError) {
        device.emit("error", error, buffer.toString());
        device.destroy();
      }
    }

    // const jsonParams = parameterize(buffer);
  });

  // device.on("fill-parameters", () => {
  //device.on("parameterize", () => {});
  //device.on("storage", () => {})
  //device.on("position", () => {})

  // device.on("v1", (buffer, arrayBuf) => {
  device.on("v1", (buffer, patternJSON) => {
    // console.log("V1:", buffer.toString(), arrayBuf);
    // device.emit("parameterize", arrayBuf);
    // device.emit("position", arrayBuf);
    device.emit("position", patternJSON);
  });

  // device.on("parameterize", (arrayBuf) => {
  device.on("position", (patternJSON) => {
    // const patternJSON = patterned(arrayBuf);
    // console.log(patternJSON);

    // console.log('device', device);
    // const position = new Position(device);
    // const position = new Position(patternJSON);
    try {
      const position = new Position(device);
      // console.log(position);
      position.decode(patternJSON);
      console.log(position);
      // console.log(position.parameters);
    } catch (error) {
      device.emit("error", error);
    }
    // position.decode(arrayBuf);
  });

  // device.on("htbt", (buffer) => device.emit("response", buffer));

  device.on("response", (buffer) => device.write(buffer));
};

// position
// const PARAMETERS = {
//   id: null,
//   peer: [null, null],
//   message: {
//     type: "H02",
//   },
//   device: {
//     id: null,
//     name: null,
//     type: null,
//   },
//   position: {
//     valid: (value) => value.valid,
//     latitude: (value, fn = () => {}) => fn(value.lat, value.latSymbol),
//     longitude: (value, fn = () => {}) => fn(value.lon, value.lonSymbol),
//     //decimalDegrees: (lat, lon) => [lat, lon],
//     date: (value, fn = () => {}) => fn(value.date, value.time),
//     // timestamp: null,
//     timestamp: (date) => new Date(date),
//     direction: (value) => value.azimuth,
//     speed: (value, fn = () => {}) => fn(value.speed),
//     altitude: null,
//     satellites: null,
//     hdop: null,
//   },
//   alarm: {},
//   server: {
//     timestamp: () => Date.now(),
//   },
// };
