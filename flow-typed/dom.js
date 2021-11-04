/* dom.js - Flow type overrides.
 * Copyright (c) 2019 - 2021 Richard Huang <rickypc@users.noreply.github.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

declare type CurrentStorageMutator = {|
  current: ?StorageMutator;
|};

declare class EventTarget {
  addEventListener(string, StorageEventHandler): void;
  dispatchEvent(CustomEvent): boolean;
  removeEventListener(string, StorageEventHandler): void;
}

declare class Storage {
  clear(): void;
  getItem(string): ?string;
  key(number): ?string;
  length: number;
  [name: string]: ?string;
  removeItem: (string) => void;
  setItem: (string, string) => void;
}

declare type StorageDetail = {
  key: string;
  value?: mixed;
};

declare type StorageEventHandler = (Event & { detail: StorageDetail }) => mixed;

declare type StorageMutator = {
  removeItem: (string) => void;
  setItem: (string, string) => void;
};
