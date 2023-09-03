import React, { useEffect, useState } from 'react';

import {
  DEFAULT_CONFIG_DATA,
  HTTP,
  HTTPS,
  IConfigData,
  PROTOCOL,
  WS,
  WSS,
} from '../constant';
import { getSetting, resetSetting, saveSetting } from '../lib/storage';

function Setting() {
  const [config, setConfig] = useState<IConfigData>(DEFAULT_CONFIG_DATA);

  useEffect(() => {
    getSetting()
      .then(config => setConfig(config))
      .catch(e => console.error(e));
  }, []);

  async function changeProtocol(event: React.ChangeEvent<HTMLSelectElement>) {
    setConfig(prevState => ({
      ...prevState,
      protocol: event.target.value as PROTOCOL,
    }));
  }

  async function changeHost(event: React.ChangeEvent<HTMLInputElement>) {
    setConfig(prevState => ({ ...prevState, host: event.target.value }));
  }

  async function changePort(event: React.ChangeEvent<HTMLInputElement>) {
    setConfig(prevState => ({
      ...prevState,
      port: event.target.valueAsNumber,
    }));
  }

  async function changeToken(event: React.ChangeEvent<HTMLInputElement>) {
    setConfig(prevState => ({
      ...prevState,
      token: event.target.value,
    }));
  }

  async function changeUserAgent(event: React.ChangeEvent<HTMLInputElement>) {
    setConfig(prevState => ({
      ...prevState,
      userAgent: event.target.value,
    }));
  }

  async function shouldUseAgent() {
    setConfig(prevState => ({
      ...prevState,
      browserUserAgent: !prevState.browserUserAgent,
    }));
  }
  async function changeReferer(event: React.ChangeEvent<HTMLInputElement>) {
    setConfig(prevState => ({
      ...prevState,
      referer: event.target.value,
    }));
  }

  async function changeHeader(event: React.ChangeEvent<HTMLInputElement>) {
    setConfig(prevState => ({
      ...prevState,
      headers: event.target.value.split(','),
    }));
  }

  async function save() {
    await saveSetting(config);
  }

  async function reset() {
    setConfig(DEFAULT_CONFIG_DATA);
    await resetSetting();
  }

  function HostConfig() {
    return (
      <React.Fragment>
        <div className="mb-1 grid grid-cols-6 gap-1">
          <div className="col-span-1">
            <label
              className="block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="protocol"
            >
              Protocol
            </label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="protocol"
                defaultValue={config.protocol}
                onChange={changeProtocol}
              >
                <option>{HTTP}</option>
                <option>{HTTPS}</option>
                <option>{WS}</option>
                <option>{WSS}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <label
              className="block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="host"
            >
              Host
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="host"
              type="text"
              value={config.host}
              onChange={changeHost}
              required
            />
          </div>
          <div className="col-span-1">
            <label
              className="block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="port"
            >
              Port
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="port"
              type="number"
              value={config.port}
              onChange={changePort}
              required
            />
          </div>
        </div>
        <div className="mb-1 w-full">
          <label
            className="block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor="token"
          >
            Token
          </label>
          <input
            className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
            id="token"
            type="password"
            value={config.token}
            onChange={changeToken}
          />
        </div>
      </React.Fragment>
    );
  }

  function UserAgent() {
    return (
      <div className="mb-1 grid grid-cols-6 gap-1">
        <div className="col-span-5">
          <label
            className="block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor="grid-userAgent"
          >
            User Agent
          </label>
          <input
            className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
            id="grid-userAgent"
            type="text"
            value={config.userAgent}
            onChange={changeUserAgent}
          />
        </div>
        <div className="col-span-1">
          <label
            className="block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor="grid-browserUserAgent"
          >
            Apply
          </label>
          <input
            className="checked:bg-primary checked:after:bg-primary checked:focus:border-primary checked:focus:bg-primary dark:checked:bg-primary dark:checked:after:bg-primary mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
            type="checkbox"
            role="switch"
            id="grid-browserUserAgent"
            checked={config.browserUserAgent}
            onChange={shouldUseAgent}
          />
        </div>
      </div>
    );
  }

  function Extra() {
    return (
      <div className="mb-1 grid grid-cols-2 gap-1">
        <div className="col-span-1">
          <label
            className="block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor="referer"
          >
            Referer
          </label>
          <input
            className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
            id="referer"
            type="url"
            value={config.referer}
            onChange={changeReferer}
          />
        </div>
        <div className="col-span-1">
          <label
            className="block text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor="headers"
          >
            Header
          </label>
          <input
            className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
            id="headers"
            type="text"
            value={config.headers.join(',')}
            onChange={changeHeader}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container h-full p-1">
      <form>
        <HostConfig />
        <UserAgent />
        <Extra />
        <div className="flex flex-row-reverse space-x-1 space-x-reverse">
          <button
            className="w-1/6 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none"
            onClick={save}
          >
            Save
          </button>
          <button
            className="w-1/6 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default Setting;
