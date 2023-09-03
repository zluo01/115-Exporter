import browser, { Cookies, Runtime } from 'webextension-polyfill';

import {
  DOWNLOAD_FILES,
  GET_FILE_INFO,
  GET_FILES_IN_FOLDER,
  IApiResponse,
  IDecodeData,
  IDownloadInfo,
  IDownloadItem,
  IFileInfo,
  IFolderData,
  IFolderInfo,
  NOTIFICATION,
} from '../constant';
import { downloadFiles } from '../lib/aria2';
import { decode, encode } from '../lib/encryption';

async function messageHandler(
  message: any,
  _: Runtime.MessageSender,
): Promise<any> {
  const { method, data } = message;
  switch (method) {
    case GET_FILE_INFO:
      return await getFileFromAPI(data);
    case GET_FILES_IN_FOLDER:
      return await getFilesInFolder(data);
    case DOWNLOAD_FILES:
      return await downloadFiles(data);
    case NOTIFICATION:
      return await notify(data);
  }
}

browser.runtime.onMessage.addListener(messageHandler);

async function getCookies(details: Cookies.GetAllDetailsType[]) {
  const cookieMap: { [name: string]: string } = {};
  for (const detail of details) {
    const cookies = await browser.cookies.getAll(detail);
    cookies.filter(o => o).forEach(o => (cookieMap[o.name] = o.value));
  }
  return cookieMap;
}

export async function getFileFromAPI(file: IFileInfo): Promise<IDownloadItem> {
  const now = Date.now();
  const timestamp = Math.floor(now / 1000);
  const { data, key } = encode(
    JSON.stringify({
      pickcode: file.pickCode,
    }),
    timestamp,
  );
  const resp = await fetch(
    `https://proapi.115.com/app/chrome/downurl?t=${timestamp}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include',
      method: 'POST',
      body: `data=${encodeURIComponent(data)}`,
    },
  );
  if (resp.ok) {
    const data = (await resp.json()) as IApiResponse;
    if (data.state) {
      const result = JSON.parse(decode(data.data, key));
      const decodeData = Object.values(result).pop() as IDecodeData;

      const file_url = decodeData.url.url;
      if (file_url) {
        const cookie = await getCookies([
          { url: 'https://proapi.115.com/', name: 'acw_tc' },
        ]);

        return {
          name: file.path + decodeData.file_name,
          link: file_url,
          size: decodeData.file_size,
          sha1: file.sha1,
          cookies: cookie,
          pickcode: file.pickCode,
        } as IDownloadItem;
      }
    }
  }
  throw new Error('Fail to get file url: ' + resp.statusText);
}

function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
    })
    .join('&');
}

export async function getFilesInFolder(
  folder: IFolderInfo,
): Promise<IDownloadInfo[]> {
  const search = {
    aid: 1,
    limit: 1000,
    show_dir: 1,
    cid: folder.cateId,
  };

  const resp = await fetch(
    `https://webapi.115.com/files?${objectToQueryString(search)}`,
    {
      credentials: 'include',
    },
  );

  const data = await resp.json();
  const path = folder.path + data.path[data.path.length - 1].name + '/';
  return data.data.map((file: IFolderData) => {
    if (!file.sha) {
      return {
        isDir: true,
        cateId: file.cid,
        path,
      } as IFolderInfo;
    }
    return {
      isDir: false,
      sha1: file.sha,
      pickCode: file.pc,
      path,
    } as IFileInfo;
  });
}

async function notify(msg: string): Promise<string> {
  return browser.notifications.create({
    type: 'basic',
    iconUrl: browser.runtime.getURL('logo192.png'),
    title: '115 File Exporter',
    message: msg,
  });
}
