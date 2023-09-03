import bigInt from 'big-integer';

const n = bigInt(
  '8686980c0f5a24c4b9d43020cd2c22703ff3f450756529058b1cf88f09b8602136477198a6e2683149659bd122c33592fdb5ad47944ad1ea4d36c6b172aad6338c3bb6ac6227502d010993ac967d1aef00f0c8e038de2e4d3bc2ec368af2e9f10a6f1eda4f7262f136420c07c331b871bf139f74f3010e3c4fe57df3afb71683',
  16,
);

const e = bigInt('10001', 16);

function byteArrayToHexString(byteArray: number[]) {
  return byteArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export function hex2a(hex: string) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return str;
}

function pkcs1pad2(inputString: string, targetLength: number) {
  const requiredPadding = targetLength - 11;
  if (requiredPadding < inputString.length) {
    throw new Error('Input string too long for padding.');
  }

  const paddedByteArray = new Array(targetLength);
  let inputIndex = inputString.length - 1;

  while (inputIndex >= 0) {
    paddedByteArray[--targetLength] = inputString.charCodeAt(inputIndex--);
  }

  paddedByteArray[--targetLength] = 0; // 0x00 padding byte

  // Fixed 0xFF padding
  while (targetLength > 2) {
    paddedByteArray[--targetLength] = 0xff;
  }

  paddedByteArray[--targetLength] = 2; // 0x02 byte
  paddedByteArray[--targetLength] = 0; // 0x00 byte

  return bigInt(byteArrayToHexString(paddedByteArray), 16);
}

function pkcs1unpad2(a: bigInt.BigNumber) {
  let b = a.toString(16);
  if (b.length % 2 !== 0) {
    b = '0' + b;
  }
  const c = hex2a(b);
  let i = 1;
  while (c.charCodeAt(i) !== 0) {
    i++;
  }
  return c.slice(i + 1);
}

export function encrypt(text: string) {
  const m = pkcs1pad2(text, 0x80);
  const c = m.modPow(e, n);
  return c.toString(16).padStart(0x80 * 2, '0');
}

export function decrypt(text: string) {
  const byteArray = text.split('').map(char => char.charCodeAt(0));
  const a = bigInt(byteArrayToHexString(byteArray), 16);
  const c = a.modPow(e, n);
  return pkcs1unpad2(c);
}
