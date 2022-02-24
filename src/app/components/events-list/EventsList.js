/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css } from 'lit';

import { mdiPodium } from '@mdi/js';

import { appStyles } from '../../css/app-style';
import { uiMessagesKeys, getUiMessage } from '../../i18n/ui-messages';
import { router } from '../../RaceResults';
import { Utils } from '../../utils/Utils';

import { EventService } from '../../service/EventService';

import '../md-icon/MdIcon';

class EventsList extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        margin-bottom: 1.5rem;
      }

      :host([hidden]) {
        display: none;
      }
    `,
    appStyles,
  ];

  static properties = {
    location: {},
    events: {},
  };

  constructor() {
    super();
    this.location = router.location;
    this.events = {};
  }

  render() {
    return Utils.isObjectEmpty(this.events) ? this.renderProgressBar() : this.renderEventsList();
  }

  connectedCallback() {
    super.connectedCallback();

    EventService.getEvents().then((result) => {
      this.events = result;
    });
  }

  /**
   * Renders the Progress Bar template.
   *
   * @returns The Progress Bar template.
   */
  renderProgressBar() {
    return html`
      <div class="section m-5">
        <progress class="progress is-info"></progress>
      </div>
    `;
  }

  /**
   * Renders the Events List template. If there an erro retrienvig the events list from the backend,
   * an error message will be rendered instead.
   *
   * @returns The Events List template.
   */
  renderEventsList() {
    if (this.events.error) {
      return html`${this.renderErrorMessage()}`;
    } else {
      return html`
        <div class="list">
          ${this.events.map((event) => {
            return html`
              <div class="list-item box">
                <div class="list-item-image">
                  <figure class="image is-64x64">
                    <md-icon path=${mdiPodium}></md-icon>
                  </figure>
                </div>

                <div class="list-item-content">
                  <div class="list-item-title"><a href=${event.eventReference}>${event.title}</a></div>
                </div>
              </div>
            `;
          })}
        </div>
      `;
    }
  }

  /**
   * Renders the Error Message template.
   *
   * @returns The Error Message template.
   */
  renderErrorMessage() {
    return html`
      <div class="notification is-warning mt-6">
        <h3 class="title is-3">${getUiMessage(uiMessagesKeys.error)}</h3>
        <p>${this.events.error}</p>
      </div>
    `;
  }
}

customElements.define('events-list', EventsList);
