export interface IApiResponse {
  state: boolean;
  msg: string;
  errno: number;
  data: string;
}

export interface IDecodeData {
  file_name: string;
  file_size: string;
  pick_code: string;
  url: IFileURL;
}

export interface IFileURL {
  url: string;
  client: number;
  desc?: string;
  isp?: string;
  oss_id: string;
  ooid: string;
}

export interface IFolderData {
  sha?: string;
  cid: string;
  pc: string;
}
