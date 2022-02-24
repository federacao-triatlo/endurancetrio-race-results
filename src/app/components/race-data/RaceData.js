/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css } from 'lit';

import { appStyles } from '../../css/app-style';

import '../results-header/ResultsHeader';
import '../results-body/ResultsBody';

class RaceData extends LitElement {
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
    location: {},
    race: {},
  };

  constructor() {
    super();
    this.location = '';
    this.race = {};
  }

  render() {
    return html`
      <results-header location="${this.location}" .race="${this.race}" }></results-header>
      <results-body .race="${this.race}"></results-body>
    `;
  }
}

customElements.define('race-data', RaceData);
