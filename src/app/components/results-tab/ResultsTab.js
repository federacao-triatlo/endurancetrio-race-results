/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

import { appStyles } from '../../css/app-style';
import { uiMessagesKeys, getUiMessage } from '../../i18n/ui-messages';

class ResultsTab extends LitElement {
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
    labels: {},
    results: {},
    _activeTab: { attribute: false, state: true },
  };

  constructor() {
    super();
    this.labels = [];
    this.results = [];
    this._activeTab = 'overall';
  }

  connectedCallback() {
    super.connectedCallback();

    document.addEventListener('event-data-change-race', () => {
      this._activeTab = 'overall';
    });
  }

  disconnectedCallback() {
    document.removeEventListener('event-data-change-race', () => {
      this._activeTab = 'overall';
    });
    super.disconnectedCallback();
  }

  render() {
    const ageGroupLabels = Array.from(this.results.keys());
    const resultsEntries = Array.from(this.results.entries());

    return html`
      <div class="tabs is-boxed">
        <ul>
          ${ageGroupLabels.map((ageGroupTitle) => {
            const classes = ageGroupTitle.toLowerCase() === this._activeTab ? 'is-active' : null;
            return html`
              <li class=${ifDefined(classes)}>
                <a id=${ageGroupTitle.toLowerCase()} @click=${this.toggleActiveTab}
                  >${ageGroupTitle === 'overall' ? getUiMessage(uiMessagesKeys[ageGroupTitle]) : ageGroupTitle}</a
                >
              </li>
            `;
          })}
        </ul>
      </div>

      <div id="tabs-content">
        ${resultsEntries.map((entry) => {
          const displayStyle = { display: entry[0].toLowerCase() === this._activeTab ? 'block' : 'none' };
          return html`
            <div class="tab-content" style=${styleMap(displayStyle)}>
              <results-table .labels=${this.labels} .results=${entry[1]}></results-table>
            </div>
          `;
        })}
      </div>
    `;
  }

  /**
   * Toggles the Age Group active tab.
   *
   * @param {Event} event The click event on the tabs menu.
   */
  toggleActiveTab(event) {
    this._activeTab = event.target.id;
  }
}

customElements.define('results-tab', ResultsTab);
