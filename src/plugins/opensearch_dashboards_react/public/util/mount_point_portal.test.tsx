/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { FC } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { MountPoint, UnmountCallback } from 'opensearch-dashboards/public';
import { MountPointPortal } from './mount_point_portal';
import { act } from 'react-dom/test-utils';

describe('MountPointPortal', () => {
  let portalTarget: HTMLElement;
  let mountPoint: MountPoint;
  let setMountPoint: jest.Mock<(mountPoint: MountPoint<HTMLElement>) => void>;
  let dom: ReactWrapper;

  const refresh = () => {
    new Promise(async (resolve) => {
      if (dom) {
        act(() => {
          dom.update();
        });
      }
      setImmediate(() => resolve(dom)); // flushes any pending promises
    });
  };

  beforeEach(() => {
    portalTarget = document.createElement('div');
    document.body.append(portalTarget);
    setMountPoint = jest.fn().mockImplementation((mp) => (mountPoint = mp));
  });

  afterEach(() => {
    if (portalTarget) {
      portalTarget.remove();
    }
  });

  it('calls the provided `setMountPoint` during render', async () => {
    dom = mount(
      <MountPointPortal setMountPoint={setMountPoint}>
        <span>portal content</span>
      </MountPointPortal>
    );

    await refresh();

    expect(setMountPoint).toHaveBeenCalledTimes(1);
  });

  it('renders the portal content when calling the mountPoint ', async () => {
    dom = mount(
      <MountPointPortal setMountPoint={setMountPoint}>
        <span>portal content</span>
      </MountPointPortal>
    );

    await refresh();

    expect(mountPoint).toBeDefined();

    act(() => {
      mountPoint(portalTarget);
    });

    await refresh();

    expect(portalTarget.innerHTML).toBe('<span>portal content</span>');
  });

  it('cleanup the portal content when the component is unmounted', async () => {
    dom = mount(
      <MountPointPortal setMountPoint={setMountPoint}>
        <span>portal content</span>
      </MountPointPortal>
    );

    act(() => {
      mountPoint(portalTarget);
    });

    await refresh();

    expect(portalTarget.innerHTML).toBe('<span>portal content</span>');

    dom.unmount();

    await refresh();

    expect(portalTarget.innerHTML).toBe('');
  });

  it('cleanup the portal content when unmounting the MountPoint from outside', async () => {
    dom = mount(
      <MountPointPortal setMountPoint={setMountPoint}>
        <span>portal content</span>
      </MountPointPortal>
    );

    let unmount: UnmountCallback;
    act(() => {
      unmount = mountPoint(portalTarget);
    });

    await refresh();

    expect(portalTarget.innerHTML).toBe('<span>portal content</span>');

    act(() => {
      unmount();
    });

    await refresh();

    expect(portalTarget.innerHTML).toBe('');
  });

  it('updates the content of the portal element when the content of MountPointPortal changes', async () => {
    const Wrapper: FC<{
      setMount: (mountPoint: MountPoint<HTMLElement>) => void;
      portalContent: string;
    }> = ({ setMount, portalContent }) => {
      return (
        <MountPointPortal setMountPoint={setMount}>
          <div>{portalContent}</div>
        </MountPointPortal>
      );
    };

    dom = mount(<Wrapper setMount={setMountPoint} portalContent={'before'} />);

    act(() => {
      mountPoint(portalTarget);
    });

    await refresh();

    expect(portalTarget.innerHTML).toBe('<div>before</div>');

    dom.setProps({
      portalContent: 'after',
    });

    await refresh();

    expect(portalTarget.innerHTML).toBe('<div>after</div>');
  });

  it('cleanup the previous portal content when setMountPoint changes', async () => {
    dom = mount(
      <MountPointPortal setMountPoint={setMountPoint}>
        <span>portal content</span>
      </MountPointPortal>
    );

    act(() => {
      mountPoint(portalTarget);
    });

    await refresh();

    expect(portalTarget.innerHTML).toBe('<span>portal content</span>');

    const newSetMountPoint = jest.fn();

    dom.setProps({
      setMountPoint: newSetMountPoint,
    });

    await refresh();

    expect(portalTarget.innerHTML).toBe('');
  });

  it('intercepts errors and display an error message', async () => {
    const CrashTest = () => {
      throw new Error('crash');
    };

    dom = mount(
      <MountPointPortal setMountPoint={setMountPoint}>
        <CrashTest />
      </MountPointPortal>
    );

    act(() => {
      mountPoint(portalTarget);
    });

    await refresh();

    expect(portalTarget.innerHTML).toBe(
      '<div class="euiText euiText--small"><p>Error rendering portal content</p></div>'
    );
  });
});
