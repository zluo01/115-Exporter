// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Aria2 from 'aria2';

import {
  DEFAULT_CONFIG_DATA,
  IConfigData,
  IDownloadItem,
} from '../../constant';
import { getSetting } from '../storage';

type Aria2ClientType = string;

const Aria2WsClient: Aria2ClientType = 'ws';
const Aria2HttpClient: Aria2ClientType = 'http';

let aria2: any;
let prevConfig: IConfigData = DEFAULT_CONFIG_DATA;

export async function ConstructAria2Instance() {
  const setting: IConfigData = await getSetting();
  if (!aria2 || JSON.stringify(prevConfig) === JSON.stringify(setting)) {
    const options = {
      path: '/jsonrpc',
      host: setting.host,
      port: setting.port,
      secure: setting.protocol === 'https' || setting.protocol === 'wss',
      secret: setting.token,
    };
    prevConfig = setting;
    aria2 = new Aria2(options);
  }

  if (setting.protocol === 'ws' || setting.protocol === 'wss') {
    return Aria2WsClient;
  }
  return Aria2HttpClient;
}

export async function downloadFiles(items: IDownloadItem[]): Promise<string> {
  if (!items.length) {
    return '';
  }
  try {
    const multiCallItems = [];
    for (const item of items) {
      const header = await constructHeaders(item.cookies);
      multiCallItems.push([
        'addUri',
        [item.link],
        {
          out: item.name,
          header,
        },
      ]);
    }
    await multiCall(multiCallItems);
    return `Start downloading ${items.length} files using Aria2`;
  } catch (e) {
    return `${e}`;
  }
}

async function multiCall(callItems: any): Promise<void> {
  const instanceType: Aria2ClientType = await ConstructAria2Instance();
  const useWebSocket = instanceType === Aria2WsClient;
  if (useWebSocket) {
    await aria2.open();
  }
  const data = await aria2.multicall(callItems);
  if (useWebSocket) {
    await aria2.close();
  }
  console.debug('Aria2 Response: ' + JSON.stringify(data));
}

async function constructHeaders(cookies: Record<string, string>) {
  const config = await getSetting();
  const headerOption = [];
  const useBrowserUA = config.browserUserAgent;
  let userAgent = config.userAgent;
  if (useBrowserUA) {
    const browserUA = navigator.userAgent;
    if (browserUA && browserUA.length) {
      userAgent = browserUA;
    }
  }

  headerOption.push(`User-Agent: ${userAgent}`);
  headerOption.push(`Referer: ${config.referer}`);

  const cookie = formatCookies(cookies);
  headerOption.push(`Cookie: ${cookie}`);
  config.headers.forEach(item => {
    headerOption.push(item);
  });
  return headerOption;
}

function formatCookies(cookies: Record<string, string>) {
  const cookieList = [];
  for (const key in cookies) {
    cookieList.push(`${key}=${cookies[key]}`);
  }
  return cookieList.join('; ');
}
