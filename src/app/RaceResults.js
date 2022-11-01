/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css } from 'lit';

import { appStyles } from './css/app-style';
import { Utils } from './utils/Utils';

import { EventService } from './service/EventService';

import './components/event-header/EventHeader';
import './components/results-data/RaceData';

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
    appStyles,
  ];

  static properties = {
    event: {},
    eventReference: { attribute: 'event-reference' },
    race: {},
    raceReference: {},
  };

  constructor() {
    super();
    this.event = {};
    this.eventReference = '';
    this.race = {};
    this.raceReference = '';
  }

  render() {
    return html`
      <article>
        <event-header .event="${this.event}"></event-header>

        <race-data
          location="${Utils.getComposedLocation(this.event.city, this.event.county, this.event.district)}"
          .race="${this.race}"
        ></race-data>
      </article>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    EventService.getEventByReference(this.eventReference).then((result) => {
      this.event = result;
    });

    this.addEventListener('event-header-change-race', (e) => {
      this.race = e.detail.race;
      this.raceReference = e.detail.race.raceReference;
    });
  }
}

customElements.define('race-results', RaceResults);
