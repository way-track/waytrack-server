import { BasePosition } from "../basePosition.js";
import { degreesMSToDDegrees } from "../utils/decode/coordinates.js";
import { strSizeSplit } from "../utils/string.js";
import { dateISO8601 } from "../utils/decode/formatDate.js";
import { knotHTokmH } from "../utils/decode/speed.js";

const TYPE = "H02";

/*
const PARAMETERS1 = [
  "id",
  ["message", ["type"]],
  ["device", ["id", "name", "type"]],
  [
    "position",
    [
      "valid",
      "latitude",
      "longitude",
      //decimalDegrees: (lat, lon) => [lat, lon],
      "date",
      //timestamp: (date) => new Date(date),
      "direction",
      "speed",
      // altitude: null,
      // satellites: null,
      // hdop: null,
    ],
  ],
  "alarm",
];
*/

export class Position extends BasePosition {
  parameters = {
    id: null,
    message: {
      type: null,
    },
    // device: {
    //   id: null,
    //   name: null,
    //   type: null,
    // },
    position: {
      valid: null,
      latitude: null,
      longitude: null,
      //decimalDegrees: (lat, lon) => [lat, lon],
      date: null,
      //timestamp: (date) => new Date(date),
      direction: null,
      speed: null,
      // altitude: null,
      // satellites: null,
      // hdop: null,
    },
    alarm: null,
  };

  constructor(device) {
    super(device);
  }

  // encode
  decode(pattern) {
    const assignParameters = (obj, name = "") => {
      // const t = this.parameters;
      Object.entries(obj).forEach(([key, value]) => {
        if (!value) {
          const method = `_${name}${!name ? key : key.toUpperCase()}`;
          if (!name) {
            // this.parameters[key] = method;
            this.parameters[key] = this[method](pattern);
          } else {
            this.parameters[name][key] = this[method](pattern);
          }
        } else {
          assignParameters(value, key);
        }
      });
    };
    // console.log(pattern); // debug
    assignParameters(this.parameters);
  }

  _id({ id }) {
    return id;
  }

  _messageTYPE({ command }) {
    return command;
  }

  _positionVALID({ valid }) {
    const isValid = {
      A: true,
      V: false,
      B: false,
    };
    return isValid[valid];
  }

  _positionLATITUDE({ lat, latSymbol }) {
    return degreesMSToDDegrees(lat, latSymbol);
  }

  _positionLONGITUDE({ lon, lonSymbol }) {
    return degreesMSToDDegrees(lon, lonSymbol);
  }

  _positionSPEED({ speed }) {
    return knotHTokmH(speed);
  }

  _positionDIRECTION({ direction }) {
    return direction;
  }

  _positionDATE({ time, date }) {
    const [hour, minute, second] = strSizeSplit(time, 2);
    const [day, month, year] = strSizeSplit(date, 2);

    return dateISO8601(
      `${day}-${month}-${year} ${hour}:${minute}:${second}`,
      "dd-MM-yy HH:mm:ss",
    );
  }

  _alarm({ status }) {
    // return status;
    return decodeAlarms("0x" + status);
  }
}

const decodeAlarms = (hexStatus) => {
  const alarms = {
    //hexStatus,
  };

  for (let bit = 0; bit < 32; bit++) {
    // 4 Bytes (32-bit)
    const mask = 1 << bit; // (1 << 0) 1-byte is 00000001
    const status = (hexStatus & mask) !== 0; // bit ON (1)

    /*
      alarms[statusAndAlarms[bit]] = !status;
      // ACC
      if (bit === 10) {
        alarms[statusAndAlarms[bit]] = status;
      }
      */

    if (statusAndAlarms[bit]) {
      switch (bit) {
        case 9: // Arm
        case 10: // ACC
        case 27: // fuelCut
          alarms[statusAndAlarms[bit]] = status;
          break;
        default:
          alarms[statusAndAlarms[bit]] = !status;
          break;
      }
    }
  }
  return alarms;
};

const statusAndAlarms = [
  null,
  "movement",
  "overSpeed",
  null,
  "fenceIn",
  "fatigueDriving",
  "harshBraking",
  "fenceOut",
  null,
  "armDisarm",
  "acc",
  "vibration",
  "lowBattery",
  "sharpTurning",
  "harshAcceleration",
  null,
  null,
  null,
  "sos",
  "devicePoweredByBackupBattery",
  "externalPowerDisconnected",
  null,
  "accOn",
  "accOff",
  null,
  null,
  "removalAlarm",
  "fuelCut",
  "powerCut",
  null,
  null,
  null,
];

/*
const statusAndEvents = {
  0: "",
  1: "movement",
  2: "overSpeed",
  3: "",
  4: "fenceIn",
  5: "fatigueDriving",
  6: "harshBraking",
  7: "fenceOut",
  8: "",
  9: "armDisarm", // Arm(0)/Disarm(1)condition
  10: "acc", // (0) ACC off, (1)ACC on
  11: "vibration",
  12: "lowBattery",
  13: "sharpTurning",
  14: "harshAcceleration",
  15: "",
  16: "",
  17: "",
  18: "sos",
  19: "devicePoweredByBackupBattery",
  20: "externalPowerDisconnected",
  21: "",
  22: "accOn",
  23: "accOff",
  24: "",
  25: "",
  26: "removalAlarm",
  27: "fuelCut", //(0) Cut fuel status, (1)resume fuel status"
  28: "powerCut",
  29: "",
  30: "",
  31: "",
};
*/
