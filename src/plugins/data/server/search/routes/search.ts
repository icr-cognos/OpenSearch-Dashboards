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

import { schema } from '@osd/config-schema';
import { IRouter } from 'src/core/server';
import { getRequestAbortedSignal } from '../../lib';
import { SearchRouteDependencies } from '../search_service';
import { shimHitsTotal } from './shim_hits_total';

export function registerSearchRoute(
  router: IRouter,
  { getStartServices }: SearchRouteDependencies
): void {
  router.post(
    {
      path: '/internal/search/{strategy}/{id?}',
      validate: {
        params: schema.object({
          strategy: schema.string(),
          id: schema.maybe(schema.string()),
        }),

        query: schema.object({}, { unknowns: 'allow' }),

        body: schema.object({}, { unknowns: 'allow' }),
      },
    },
    async (context, request, res) => {
      const searchRequest = request.body;
      const { strategy, id } = request.params;
      const abortSignal = getRequestAbortedSignal(request.events.aborted$);

      const [, , selfStart] = await getStartServices();

      try {
        const { withLongNumeralsSupport, ...response } = await selfStart.search.search(
          context,
          { ...searchRequest, id, rawRequest: request },
          {
            abortSignal,
            strategy,
          }
        );

        return res.ok({
          body: {
            ...response,
            ...{
              rawResponse: shimHitsTotal(response.rawResponse),
            },
          },
          withLongNumeralsSupport,
        });
      } catch (err) {
        return res.customError({
          statusCode: err.statusCode || 500,
          body: {
            message: err.message,
            attributes: {
              error: err.body?.error || err.message,
            },
          },
        });
      }
    }
  );

  router.delete(
    {
      path: '/internal/search/{strategy}/{id}',
      validate: {
        params: schema.object({
          strategy: schema.string(),
          id: schema.string(),
        }),

        query: schema.object({}, { unknowns: 'allow' }),
      },
    },
    async (context, request, res) => {
      const { strategy, id } = request.params;

      const [, , selfStart] = await getStartServices();
      const searchStrategy = selfStart.search.getSearchStrategy(strategy);
      if (!searchStrategy.cancel) return res.ok();

      try {
        await searchStrategy.cancel(context, id);
        return res.ok();
      } catch (err) {
        return res.customError({
          statusCode: err.statusCode,
          body: {
            message: err.message,
            attributes: {
              error: err.body.error,
            },
          },
        });
      }
    }
  );
}
