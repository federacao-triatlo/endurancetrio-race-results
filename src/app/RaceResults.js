/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css } from 'lit';

import './components/events-list/EventsList';

class RaceResults extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }
    `,
  ];

  render() {
    return html`<events-list event-reference="20220220FTP001"></events-list>`;
  }
}

customElements.define('race-results', RaceResults);
