import { ReactElement } from 'react';

import { DOWNLOAD_FILES, NOTIFICATION } from '../constant';
import {
  getFilesDownloadInfo,
  getSelectedFiles,
  sendRequest,
} from '../lib/core';

function App(): ReactElement {
  async function download() {
    const selected = await getSelectedFiles();
    await sendRequest(NOTIFICATION, 'Gathering Files Information.');
    const files = await getFilesDownloadInfo(selected);
    const resp: string = await sendRequest<string>(DOWNLOAD_FILES, files);
    if (resp) {
      await sendRequest(NOTIFICATION, resp);
    }
  }

  return (
    <button
      className="absolute right-24 top-20 z-10 h-8 w-24 rounded border border-[#2777F8] bg-transparent font-semibold text-[#2777F8] shadow-sm hover:border-transparent hover:bg-[#2777F8] hover:text-white"
      onClick={download}
    >
      Download
    </button>
  );
}

export default App;
