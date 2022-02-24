/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css } from 'lit';

import { appStyles } from '../../css/app-style';
import { uiMessagesKeys, getUiMessage } from '../../i18n/ui-messages';
import { router } from '../../RaceResults';
import { Utils } from '../../utils/Utils';

import { EventService } from '../../service/EventService';

import '../race-data/RaceData';

class EventData extends LitElement {
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
    location: { type: Object },
    event: {},
    race: {},
  };

  constructor() {
    super();
    this.location = router.location;
    this.event = {};
    this.race = {};
  }

  connectedCallback() {
    super.connectedCallback();
    EventService.getEventByReference(this.location.params.eventReference).then((result) => {
      this.event = result;
    });
  }

  render() {
    return html`
      <section class="box has-background-link-light mb-4">
        ${Utils.isObjectEmpty(this.event) ? this.renderProgressBar() : this.renderEventHeader()}
      </section>

      <race-data
        location="${Utils.getComposedLocation(this.event.city, this.event.county, this.event.district)}"
        .race="${this.race}"
      ></race-data>
    `;
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
   * Renders the Event Header template.
   *
   * @returns The Event Header template.
   */
  renderEventHeader() {
    const composedEventDate = getComposedEventDate(this.event.startDate, this.event.endDate);
    const composedEventLocation = Utils.getComposedLocation(this.event.city, this.event.county, this.event.district);

    if (this.event.error) {
      return html`${this.renderErrorMessage()}`;
    } else {
      return html`
        <h3 class="title is-3">${this.event.title}</h3>
        <p class="subtitle is-5">
          <span>${composedEventDate}</span>
          ${composedEventDate && composedEventLocation ? ' | ' : ''}
          <span>${composedEventLocation}</span>
        </p>

        <form>
          <fieldset class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">${getUiMessage(uiMessagesKeys.results)}</label>
            </div>

            <div class="field-body">
              <div class="field">
                <div class="control">
                  <div class="select is-normal is-fullwidth">
                    <select @change="${this.handleChangeSelection}">
                      <option disabled selected>-- ${getUiMessage(uiMessagesKeys.resultsPlaceholder)} --</option>
                      ${this.event.races.map((race) => {
                        const optionText = race.subtitle ? race.title.concat(' - ', race.subtitle) : race.title;
                        return html`<option value="${race.raceReference}">${optionText}</option>`;
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
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
        <p>${this.event.error}</p>
      </div>
    `;
  }

  /**
   * Handles the change of the option on the race's dropdown.
   *
   * @param {Event} e The event to be handled.
   */
  handleChangeSelection(e) {
    if (this.event.races && this.event.races.length > 0) {
      this.event.races.map((race) => {
        if (race.raceReference == e.target.value) {
          this.race = race;
        }
      });
    }

    this.dispatchEvent(new CustomEvent('event-data-change-race', { bubbles: true, composed: true }));
  }
}

/**
 * Gets the composed event's date in a well formatted string.
 *
 * @param {String} eventStartDate The event start date.
 * @param {String} eventEndDate The event end date.
 * @returns The event's composed date in a and well formatted string.
 */
function getComposedEventDate(eventStartDate, eventEndDate) {
  const startDate = new Date(eventStartDate);
  const endDate = new Date(eventEndDate);
  let eventDate = '';

  if (startDate.getTime() == endDate.getTime()) {
    eventDate = startDate.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
  } else if (startDate.getMonth() == endDate.getMonth()) {
    eventDate = startDate
      .toLocaleDateString('pt-PT', { day: 'numeric' })
      .concat(' - ', endDate.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' }));
  } else {
    eventDate = startDate
      .toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })
      .concat(' - ', endDate.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' }));
  }

  return eventDate;
}

customElements.define('event-data', EventData);
