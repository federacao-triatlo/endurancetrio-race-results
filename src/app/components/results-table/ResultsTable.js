/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css } from 'lit';

import { appStyles } from '../../css/app-style';
import naturalSort from '../../vendor/naturalSort';

import '../table-header/TableHeader';

class ResultsTable extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }

      th {
        cursor: pointer;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `,
    appStyles,
  ];

  static properties = {
    labels: {},
    results: {},
    _sortColumn: { attribute: false, state: true },
    _sortingOrder: { attribute: false, state: true },
  };

  constructor() {
    super();
    this.labels = {};
    this.results = [];
    this._sortColumn = 'rank';
    this._sortingOrder = 1;
  }

  connectedCallback() {
    super.connectedCallback();

    document.addEventListener('event-data-change-race', () => {
      this._sortColumn = 'rank';
      this._sortingOrder = 1;
    });
  }

  disconnectedCallback() {
    document.removeEventListener('event-data-change-race', () => {
      this._sortColumn = 'rank';
      this._sortingOrder = 1;
    });
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="table-container">
        <table class="table is-fullwidth is-striped is-narrow is-hoverable">
          <thead>
            ${this.labels.map((label) => {
              return html`
                <th>
                  <table-header
                    id=${label.key}
                    label=${label.label}
                    sorting-index=${this.getSortingIndex(label.key)}
                    @click=${this.sortTable}
                  ></table-header>
                </th>
              `;
            })}
          </thead>
          <tbody>
            ${this.results.map((result) => {
              return html`
                <tr>
                  ${this.labels.map((label) => {
                    return html`<td>${result[label.key]}</td>`;
                  })}
                </tr>
              `;
            })}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Sorts the table based on the column thar was clicked by the user. When the user clicks the column
   * for the first time, the sorting is made in ascending order. When the user clicks, sequentially,
   * the column, the sorting is made in descending order. The process is repeated if the user keeps
   * on clicking the same column.
   *
   * @param {Event} event The event that triggers the sorting action
   */
  sortTable(event) {
    this._sortingOrder = this._sortColumn === event.target.id ? -1 * this._sortingOrder : 1;
    this.results.sort((row1, row2) => {
      naturalSort.insensitive = true;
      return this._sortingOrder * naturalSort(row1[event.target.id], row2[event.target.id]);
    });
    this._sortColumn = event.target.id;
  }

  /**
   * Get the order index of the given column.
   *
   * @param {String} columnKey The column key.
   * @returns The order index of the given column.
   */
  getSortingIndex(columnKey) {
    return this._sortColumn === columnKey ? this._sortingOrder : 0;
  }
}

customElements.define('results-table', ResultsTable);
