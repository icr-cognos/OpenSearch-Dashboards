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

import PropTypes from 'prop-types';
import React from 'react';
import { EuiCompressedComboBox } from '@elastic/eui';
import { injectI18n } from '@osd/i18n/react';
import { isGroupByFieldsEnabled } from '../../lib/check_ui_restrictions';

function GroupBySelectUi(props) {
  const { intl, uiRestrictions } = props;
  const modeOptions = [
    {
      label: intl.formatMessage({
        id: 'visTypeTimeseries.splits.groupBySelect.modeOptions.everythingLabel',
        defaultMessage: 'Everything',
      }),
      value: 'everything',
    },
    {
      label: intl.formatMessage({
        id: 'visTypeTimeseries.splits.groupBySelect.modeOptions.filterLabel',
        defaultMessage: 'Filter',
      }),
      value: 'filter',
    },
    {
      label: intl.formatMessage({
        id: 'visTypeTimeseries.splits.groupBySelect.modeOptions.filtersLabel',
        defaultMessage: 'Filters',
      }),
      value: 'filters',
    },
    {
      label: intl.formatMessage({
        id: 'visTypeTimeseries.splits.groupBySelect.modeOptions.termsLabel',
        defaultMessage: 'Terms',
      }),
      value: 'terms',
    },
  ].map((field) => ({
    ...field,
    disabled: !isGroupByFieldsEnabled(field.value, uiRestrictions),
  }));

  const selectedValue = props.value || 'everything';
  const selectedOption = modeOptions.find((option) => {
    return selectedValue === option.value;
  });

  return (
    <EuiCompressedComboBox
      id={props.id}
      isClearable={false}
      options={modeOptions}
      selectedOptions={[selectedOption]}
      onChange={props.onChange}
      singleSelection={{ asPlainText: true }}
    />
  );
}

GroupBySelectUi.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  uiRestrictions: PropTypes.object,
};

export const GroupBySelect = injectI18n(GroupBySelectUi);
