import browser from 'webextension-polyfill';

import {
  GET_FILE_INFO,
  GET_FILES_IN_FOLDER,
  IDownloadInfo,
  IDownloadItem,
  IFileInfo,
  IFolderInfo,
  METHOD_TYPE,
} from '../../constant';

function getFileInfoFromElements(
  selectedList: NodeListOf<Element>,
): IDownloadInfo[] {
  const info: IDownloadInfo[] = [];
  Array.from(selectedList).forEach(file => {
    const type = file.getAttribute('file_type');
    if (type === '1') {
      info.push({
        isDir: false,
        sha1: file.getAttribute('sha1'),
        pickCode: file.getAttribute('pick_code'),
        path: '',
      } as IFileInfo);
    }
    // folder
    if (type === '0') {
      info.push({
        isDir: true,
        cateId: file.getAttribute('cate_id'),
        path: '',
      } as IFolderInfo);
    }
  });
  return info;
}

export async function getSelectedFiles(): Promise<IDownloadInfo[]> {
  const context = (
    document.querySelector('iframe[rel="wangpan"]') as HTMLIFrameElement
  )?.contentDocument;
  const contentList = context?.querySelectorAll('li[rel="item"].selected');
  if (!contentList) {
    return [];
  }
  return getFileInfoFromElements(contentList);
}

export async function getFilesDownloadInfo(items: IDownloadInfo[]) {
  const folders = items.filter(o => o.isDir);
  const files = items.filter(o => !o.isDir);

  if (folders.length) {
    for (const folder of folders) {
      const folderFiles = await aggregateFileUnderFolder(folder as IFolderInfo);
      files.push(...folderFiles);
    }
  }

  const downloadItems: IDownloadItem[] = [];
  for (const file of files) {
    downloadItems.push(await sendRequest<IDownloadItem>(GET_FILE_INFO, file));
  }
  return downloadItems;
}

async function aggregateFileUnderFolder(
  folder: IFolderInfo,
): Promise<IFileInfo[]> {
  const queue: IFolderInfo[] = [folder];
  const files: IFileInfo[] = [];
  while (queue.length > 0) {
    const currFolder = queue.shift() as IFolderInfo;
    const items = await sendRequest<IDownloadInfo[]>(
      GET_FILES_IN_FOLDER,
      currFolder,
    );
    items.forEach(o => {
      if (o.isDir) {
        queue.push(o as IFolderInfo);
      } else {
        files.push(o as IFileInfo);
      }
    });
  }
  return files;
}

export async function sendRequest<T>(
  method: METHOD_TYPE,
  data?: any,
): Promise<T> {
  return await browser.runtime.sendMessage({
    method,
    data,
  });
}
