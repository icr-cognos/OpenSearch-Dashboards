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

import { includedFields } from './included_fields';

const BASE_FIELD_COUNT = 11;

describe('includedFields', () => {
  it('returns undefined if fields are not provided', () => {
    expect(includedFields()).toBe(undefined);
  });

  it('accepts type string', () => {
    const fields = includedFields('config', 'foo');
    expect(fields).toHaveLength(BASE_FIELD_COUNT);
    expect(fields).toContain('type');
  });

  it('accepts type as string array', () => {
    const fields = includedFields(['config', 'secret'], 'foo');
    expect(fields).toMatchInlineSnapshot(`
Array [
  "config.foo",
  "secret.foo",
  "namespace",
  "namespaces",
  "type",
  "references",
  "migrationVersion",
  "updated_at",
  "originId",
  "workspaces",
  "permissions",
  "foo",
]
`);
  });

  it('accepts field as string', () => {
    const fields = includedFields('config', 'foo');
    expect(fields).toHaveLength(BASE_FIELD_COUNT);
    expect(fields).toContain('config.foo');
  });

  it('accepts fields as an array', () => {
    const fields = includedFields('config', ['foo', 'bar']);

    expect(fields).toHaveLength(BASE_FIELD_COUNT + 2);
    expect(fields).toContain('config.foo');
    expect(fields).toContain('config.bar');
  });

  it('accepts type as string array and fields as string array', () => {
    const fields = includedFields(['config', 'secret'], ['foo', 'bar']);
    expect(fields).toMatchInlineSnapshot(`
Array [
  "config.foo",
  "config.bar",
  "secret.foo",
  "secret.bar",
  "namespace",
  "namespaces",
  "type",
  "references",
  "migrationVersion",
  "updated_at",
  "originId",
  "workspaces",
  "permissions",
  "foo",
  "bar",
]
`);
  });

  it('includes namespace', () => {
    const fields = includedFields('config', 'foo');
    expect(fields).toHaveLength(BASE_FIELD_COUNT);
    expect(fields).toContain('namespace');
  });

  it('includes namespaces', () => {
    const fields = includedFields('config', 'foo');
    expect(fields).toHaveLength(BASE_FIELD_COUNT);
    expect(fields).toContain('namespaces');
  });

  it('includes references', () => {
    const fields = includedFields('config', 'foo');
    expect(fields).toHaveLength(BASE_FIELD_COUNT);
    expect(fields).toContain('references');
  });

  it('includes migrationVersion', () => {
    const fields = includedFields('config', 'foo');
    expect(fields).toHaveLength(BASE_FIELD_COUNT);
    expect(fields).toContain('migrationVersion');
  });

  it('includes updated_at', () => {
    const fields = includedFields('config', 'foo');
    expect(fields).toHaveLength(BASE_FIELD_COUNT);
    expect(fields).toContain('updated_at');
  });

  it('includes originId', () => {
    const fields = includedFields('config', 'foo');
    expect(fields).toHaveLength(BASE_FIELD_COUNT);
    expect(fields).toContain('originId');
  });

  it('uses wildcard when type is not provided', () => {
    const fields = includedFields(undefined, 'foo');
    expect(fields).toHaveLength(BASE_FIELD_COUNT);
    expect(fields).toContain('*.foo');
  });

  describe('v5 compatibility', () => {
    it('includes legacy field path', () => {
      const fields = includedFields('config', ['foo', 'bar']);

      expect(fields).toHaveLength(BASE_FIELD_COUNT + 2);
      expect(fields).toContain('foo');
      expect(fields).toContain('bar');
    });
  });
});
