import { LitElement, html, css } from 'lit';

import { appStyles } from '../../css/app-style';
import { Utils } from '../../utils/Utils';

import { EventService } from '../../service/EventService';

import '../event-header/EventHeader';
import '../results-data/RaceData';

class EventsList extends LitElement {
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
    resultsReference: {},
  };

  constructor() {
    super();
    this.event = {};
    this.eventReference = '';
    this.race = {};
    this.resultsReference = '';
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
      this.resultsReference = e.detail.race.resultsReference;
    });
  }
}

customElements.define('events-list', EventsList);
