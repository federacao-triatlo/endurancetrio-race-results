/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css } from 'lit';

import { appStyles } from '../../css/app-style';
import { getErrorMessage, errorMessagesKeys } from '../../i18n/error-messages';
import { getUiMessage, uiMessagesKeys } from '../../i18n/ui-messages';
import { Utils } from '../../utils/Utils';

import { ResultsService } from '../../service/ResultsService';

import '../results-tab/ResultsTab';
import '../results-table/ResultsTable';

class ResultsBody extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }
    `,
    appStyles,
  ];

  static properties = {
    race: {},
    _lastFetchedRaceReference: { attribute: false, state: true },
  };

  constructor() {
    super();
    this.race = {};
    this._lastFetchedRaceReference = '';
  }

  render() {
    const hasRace = !Utils.isObjectEmpty(this.race);
    const hasResults =
      hasRace &&
      !Utils.isObjectEmpty(this.race.results) &&
      this.race.results instanceof Map &&
      !this.race.results.has('error');

    if (hasRace && !hasResults && this._lastFetchedRaceReference != this.race.raceReference) {
      ResultsService.getResultsByReference(this.race.raceReference).then((apiData) => {
        updateRaceWithActualData(this.race, apiData);
        this.race.results = apiData.results;
        this.dispatchEvent(
          new CustomEvent('results-body-update-race', { bubbles: true, composed: true, detail: { race: this.race } })
        );
        this._lastFetchedRaceReference = this.race.raceReference;
      });
    }

    if (hasRace && !('results' in this.race)) {
      return html`${this.renderProgressBar()}`;
    }

    if (hasRace && this.race.results instanceof Map) {
      if (this.race.results.has('error')) {
        return this.renderErrorMessage();
      } else {
        switch (this.race.results.size) {
          case 0:
            return html`${this.renderNoResultsMessage()}`;
          case 1:
            if (this.race.results.get('overall').length > 0) {
              return html`
                <results-table
                  .labels=${getResultsTableColumnLabels(this.race.results.get('overall'))}
                  .results=${this.race.results.get('overall')}
                ></results-table>
              `;
            }
            return html`${this.renderNoResultsMessage()}`;
          default:
            return html`
              <results-tab
                .labels=${getResultsTableColumnLabels(this.race.results.get('overall'))}
                .results=${this.race.results}
              ></results-tab>
            `;
        }
      }
    }
  }

  /**
   * Renders the Progress Bar template.
   *
   * @returns The Progress Bar template.
   */
  renderProgressBar() {
    return html`<progress class="progress is-info"></progress>`;
  }

  /**
   * Renders the Error Message template.
   *
   * @returns The Error Message template.
   */
  renderErrorMessage() {
    return html`
      <div class="notification is-warning mt-6">
        <p>${this.race.results.get('error')}</p>
      </div>
    `;
  }

  /**
   * Renders the Results Not found Message template.
   *
   * @returns the Results Not Found Message Template.
   */
  renderNoResultsMessage() {
    return html`
      <div class="notification is-warning mt-6">
        <p>${getErrorMessage(errorMessagesKeys['resultsNotFound'])}</p>
      </div>
    `;
  }
}

/**
 * Updates the Race data with the data retrieved from the API Backend.
 *
 * @param {Object} apiData the Race data retrieved from the API Backend.
 */
function updateRaceWithActualData(race, apiData) {
  race.actualDate = apiData.actualDate ? apiData.actualDate : race.actualDate;
  race.actualTime = apiData.actualTime ? apiData.actualTime : race.actualTime;
}

/**
 * Gets the labels for the columns of the results table.
 *
 * @param {Array} results
 * @returns The labels for the columns of the results table.
 */
function getResultsTableColumnLabels(results) {
  const labels = [];
  const resultKeys = Object.keys(results[0]);

  resultKeys.map((key) => {
    labels.push({ key: key, label: getUiMessage(uiMessagesKeys[key]) });
  });

  return labels;
}

customElements.define('results-body', ResultsBody);
