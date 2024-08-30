import { Buffer } from "node:buffer";

/*
 * return a string array:
 * [ '*HQ', '869731054181615', 'HTBT' ]
 *
 */
export const bufferToStringArray = (
  buffer,
  separatorString = String.fromCodePoint(separatorByte),
  encoding = "ascii",
) => {
  if (!separatorString) throw new Error("separatorString is not defined");

  const bufWithoutNumberSign = buffer.subarray(0, buffer.length - 1);
  return bufWithoutNumberSign.toString(encoding).split(separatorString);
};

/*
 * return a buffer array:
 * [ <Buffer 2a 48 51>,
 * <Buffer 38 36 39 37 33 31 30 35 34 31 38 31 36 31 35>,
 * <Buffer 48 54 42 54> ]
 *
 */
export const bufferToBufferArray = (buffer, separatorByte = separatorByte) => {
  let start = 0;
  const arrayBuf = [];

  let end = buffer.indexOf(separatorByte);

  while (end !== -1) {
    arrayBuf.push(buffer.subarray(start, end));
    start = end + 1;
    end = buffer.indexOf(separatorByte, start);
  }

  arrayBuf.push(buffer.subarray(start, buffer.length - 1));

  return arrayBuf;
};
/*
const bufferToBufferArray = (buffer, separatorByte = separatorByte) => {
  if (!separatorByte) throw new Error("separatorByte is not defined");

  const arrayBuf = [];
  let element = [];
  // buffer[buffer.length - 1] = separatorByte;
  const bufWithoutNumberSign = buffer.subarray(0, buffer.length-1);
  const buf = Buffer.concat([bufWithoutNumberSign, Buffer.from(separatorByte)]);

  console.log("bufWithoutNumberSign:", buf.toString())

  for (let value of buf.values()) {
    if (value !== separatorByte) {
      element.push(value);
    } else {
      arrayBuf.push(Buffer.from(element));
      element = [];
    }
  }

  return arrayBuf;
};
*/
