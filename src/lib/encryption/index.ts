import md5 from './md5';
import { decrypt, encrypt, hex2a } from './rsa';

const kts = [
  240, 229, 105, 174, 191, 220, 191, 138, 26, 69, 232, 190, 125, 166, 115, 184,
  222, 143, 231, 196, 69, 218, 134, 196, 155, 100, 139, 20, 106, 180, 241, 170,
  56, 1, 53, 158, 38, 105, 44, 134, 0, 107, 79, 165, 54, 52, 98, 166, 42, 150,
  104, 24, 242, 74, 253, 189, 107, 151, 143, 77, 143, 137, 19, 183, 108, 142,
  147, 237, 14, 13, 72, 62, 215, 47, 136, 216, 254, 254, 126, 134, 80, 149, 79,
  209, 235, 131, 38, 52, 219, 102, 123, 156, 126, 157, 122, 129, 50, 234, 182,
  51, 222, 58, 169, 89, 52, 102, 59, 170, 186, 129, 96, 72, 185, 213, 129, 156,
  248, 108, 132, 119, 255, 84, 120, 38, 95, 190, 232, 30, 54, 159, 52, 128, 92,
  69, 44, 155, 118, 213, 27, 143, 204, 195, 184, 245,
];

const keyS = [0x29, 0x23, 0x21, 0x5e];

const keyL = [120, 6, 173, 76, 51, 134, 93, 24, 76, 1, 63, 70];

function xor115Enc(
  src: number[],
  srclen: number,
  key: number[],
  keylen: number,
) {
  let i, j, k, mod4, ref, ref1, ref2, ret;
  mod4 = srclen % 4;
  ret = [];
  if (mod4 !== 0) {
    for (
      i = j = 0, ref = mod4;
      ref >= 0 ? j < ref : j > ref;
      i = ref >= 0 ? ++j : --j
    ) {
      ret.push(src[i] ^ key[i % keylen]);
    }
  }
  for (
    i = k = ref1 = mod4, ref2 = srclen;
    ref1 <= ref2 ? k < ref2 : k > ref2;
    i = ref1 <= ref2 ? ++k : --k
  ) {
    ret.push(src[i] ^ key[(i - mod4) % keylen]);
  }
  return ret;
}

function getkey(length: number, key: number[]) {
  let i;
  if (key != null) {
    return (() => {
      let j, ref, results;
      results = [];
      for (
        i = j = 0, ref = length;
        ref >= 0 ? j < ref : j > ref;
        i = ref >= 0 ? ++j : --j
      ) {
        results.push(
          ((key[i] + kts[length * i]) & 0xff) ^ kts[length * (length - 1 - i)],
        );
      }
      return results;
    })();
  }
  if (length === 12) {
    return keyL.slice(0);
  }
  return keyS.slice(0);
}

function asymEncode(src: number[], srclen: number) {
  let i, j, m, ref, ret;
  m = 128 - 11;
  ret = '';
  for (
    i = j = 0, ref = Math.floor((srclen + m - 1) / m);
    ref >= 0 ? j < ref : j > ref;
    i = ref >= 0 ? ++j : --j
  ) {
    ret += encrypt(
      bytesToString(src.slice(i * m, Math.min((i + 1) * m, srclen))),
    );
  }
  return btoa(hex2a(ret));
}

function asymDecode(src: number[], srclen: number) {
  let i, j, m, ref, ret;
  m = 128;
  ret = '';
  for (
    i = j = 0, ref = Math.floor((srclen + m - 1) / m);
    ref >= 0 ? j < ref : j > ref;
    i = ref >= 0 ? ++j : --j
  ) {
    ret += decrypt(
      bytesToString(src.slice(i * m, Math.min((i + 1) * m, srclen))),
    );
  }
  return stringToBytes(ret);
}

function symEncode(src: number[], srclen: number, key1: number[], key2: any) {
  let k1, k2, ret;
  k1 = getkey(4, key1);
  k2 = getkey(12, key2);
  ret = xor115Enc(src, srclen, k1, 4);
  ret.reverse();
  ret = xor115Enc(ret, srclen, k2, 12);
  return ret;
}

function symDecode(
  src: number[],
  srclen: number,
  key1: number[],
  key2: number[],
) {
  let k1, k2, ret;
  k1 = getkey(4, key1);
  k2 = getkey(12, key2);
  ret = xor115Enc(src, srclen, k2, 12);
  ret.reverse();
  ret = xor115Enc(ret, srclen, k1, 4);
  return ret;
}

function bytesToString(buf: number[]) {
  return String.fromCharCode(...buf);
}

function stringToBytes(str: string): number[] {
  let i, j, ref, ret;
  ret = [];
  for (
    i = j = 0, ref = str.length;
    ref >= 0 ? j < ref : j > ref;
    i = ref >= 0 ? ++j : --j
  ) {
    ret.push(str.charCodeAt(i));
  }
  return ret;
}

export function encode(str: string, timestamp: number) {
  const key = stringToBytes(md5(`!@###@#${timestamp}DFDR@#@#`));
  let temp = stringToBytes(str);
  temp = symEncode(temp, temp.length, key, null);
  temp = key.slice(0, 16).concat(temp);
  return {
    data: asymEncode(temp, temp.length),
    key,
  };
}

export function decode(str: string, key: number[]) {
  let temp = stringToBytes(atob(str));
  temp = asymDecode(temp, temp.length);
  return bytesToString(
    symDecode(temp.slice(16), temp.length - 16, key, temp.slice(0, 16)),
  );
}
