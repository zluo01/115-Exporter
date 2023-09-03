export const HTTP = 'http';
export const HTTPS = 'https';
export const WS = 'ws';
export const WSS = 'wss';

export type PROTOCOL = typeof HTTP | typeof HTTPS | typeof WS | typeof WSS;

export interface IConfigData {
  protocol: PROTOCOL;
  host: string;
  port: number;
  token: string;
  userAgent: string;
  browserUserAgent: boolean;
  referer: string;
  headers: string[];
}

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36 115Browser/5.1.3';

const DEFAULT_REFERER = 'https://115.com/';

export const DEFAULT_CONFIG_DATA: IConfigData = {
  protocol: HTTP,
  host: '127.0.0.1',
  port: 6800,
  token: '',
  userAgent: DEFAULT_USER_AGENT,
  browserUserAgent: true,
  referer: DEFAULT_REFERER,
  headers: [],
};
