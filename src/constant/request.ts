export interface IFileInfo {
  type: 'File';
  isDir: boolean;
  sha1: string;
  pickCode: string;
  path: string;
}

export interface IFolderInfo {
  type: 'Folder';
  isDir: boolean;
  cateId: string;
  path: string;
}

export type IDownloadInfo = IFileInfo | IFolderInfo;

export interface IDownloadItem {
  name: string;
  link: string;
  size: string;
  sha1: string;
  cookies: any;
  pickcode: string;
}

export const GET_FILE_INFO = 'GET_FILE_INFO';
export const GET_FILES_IN_FOLDER = 'GET_FILES_IN_FOLDER';
export const DOWNLOAD_FILES = 'DOWNLOAD_FILES';
export const NOTIFICATION = 'NOTIFICATION';

export type METHOD_TYPE =
  | typeof GET_FILE_INFO
  | typeof GET_FILES_IN_FOLDER
  | typeof DOWNLOAD_FILES
  | typeof NOTIFICATION;
