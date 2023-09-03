import browser from 'webextension-polyfill';

import { DEFAULT_CONFIG_DATA, IConfigData } from '../../constant';

export async function getSetting(): Promise<IConfigData> {
  const items = await browser.storage.local.get(null);
  return Object.assign({}, DEFAULT_CONFIG_DATA, items);
}

export async function saveSetting(configData: IConfigData): Promise<void> {
  await browser.storage.local.set(configData);
}

export async function resetSetting(): Promise<void> {
  await browser.storage.local.clear();
}
