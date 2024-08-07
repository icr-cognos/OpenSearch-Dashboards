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

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@osd/i18n/react';
import { i18n } from '@osd/i18n';

import { EuiFlexGroup, EuiFlexItem, EuiCompressedFormRow, EuiCompressedSelect } from '@elastic/eui';

export const CronYearly = ({
  minute,
  minuteOptions,
  hour,
  hourOptions,
  date,
  dateOptions,
  month,
  monthOptions,
  onChange,
}) => (
  <Fragment>
    <EuiCompressedFormRow
      label={
        <FormattedMessage
          id="opensearchUi.cronEditor.cronYearly.fieldMonthLabel"
          defaultMessage="Month"
        />
      }
      fullWidth
      data-test-subj="cronFrequencyConfiguration"
    >
      <EuiCompressedSelect
        options={monthOptions}
        value={month}
        onChange={(e) => onChange({ month: e.target.value })}
        fullWidth
        prepend={i18n.translate('opensearchUi.cronEditor.cronYearly.fieldMonth.textInLabel', {
          defaultMessage: 'In',
        })}
        data-test-subj="cronFrequencyYearlyMonthSelect"
      />
    </EuiCompressedFormRow>

    <EuiCompressedFormRow
      label={
        <FormattedMessage
          id="opensearchUi.cronEditor.cronYearly.fieldDateLabel"
          defaultMessage="Date"
        />
      }
      fullWidth
      data-test-subj="cronFrequencyConfiguration"
    >
      <EuiCompressedSelect
        options={dateOptions}
        value={date}
        onChange={(e) => onChange({ date: e.target.value })}
        fullWidth
        prepend={i18n.translate('opensearchUi.cronEditor.cronYearly.fieldDate.textOnTheLabel', {
          defaultMessage: 'On the',
        })}
        data-test-subj="cronFrequencyYearlyDateSelect"
      />
    </EuiCompressedFormRow>

    <EuiCompressedFormRow
      label={
        <FormattedMessage
          id="opensearchUi.cronEditor.cronYearly.fieldTimeLabel"
          defaultMessage="Time"
        />
      }
      fullWidth
      data-test-subj="cronFrequencyConfiguration"
    >
      <EuiFlexGroup gutterSize="xs">
        <EuiFlexItem grow={false}>
          <EuiCompressedSelect
            options={hourOptions}
            value={hour}
            aria-label={i18n.translate('opensearchUi.cronEditor.cronYearly.hourSelectLabel', {
              defaultMessage: 'Hour',
            })}
            onChange={(e) => onChange({ hour: e.target.value })}
            fullWidth
            prepend={i18n.translate('opensearchUi.cronEditor.cronYearly.fieldHour.textAtLabel', {
              defaultMessage: 'At',
            })}
            data-test-subj="cronFrequencyYearlyHourSelect"
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiCompressedSelect
            options={minuteOptions}
            value={minute}
            aria-label={i18n.translate('opensearchUi.cronEditor.cronYearly.minuteSelectLabel', {
              defaultMessage: 'Minute',
            })}
            onChange={(e) => onChange({ minute: e.target.value })}
            fullWidth
            prepend=":"
            data-test-subj="cronFrequencyYearlyMinuteSelect"
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiCompressedFormRow>
  </Fragment>
);

CronYearly.propTypes = {
  minute: PropTypes.string.isRequired,
  minuteOptions: PropTypes.array.isRequired,
  hour: PropTypes.string.isRequired,
  hourOptions: PropTypes.array.isRequired,
  date: PropTypes.string.isRequired,
  dateOptions: PropTypes.array.isRequired,
  month: PropTypes.string.isRequired,
  monthOptions: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
