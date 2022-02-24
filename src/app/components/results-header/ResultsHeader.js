/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css } from 'lit';

import { appStyles } from '../../css/app-style';
import { getUiMessage, uiMessagesKeys } from '../../i18n/ui-messages';
import { Utils } from '../../utils/Utils';

class ResultsHeader extends LitElement {
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

  connectedCallback() {
    super.connectedCallback();

    document.addEventListener('results-body-update-race', () => {
      this.update();
    });
  }

  disconnectedCallback() {
    document.removeEventListener('results-body-update-race', () => {
      this.update();
    });
    super.disconnectedCallback();
  }

  render() {
    return html`<section class="mb-4">${Utils.isObjectEmpty(this.race) ? null : this.renderRaceHeader()}</section>`;
  }

  /**
   * Renders the Race Header template.
   *
   * @returns The Race Header template.
   */
  renderRaceHeader() {
    const distanceNumberFormat = new Intl.NumberFormat('pt-PT', {
      locales: 'lookup',
      style: 'unit',
      unit: 'meter',
      useGrouping: 'always',
    });

    return html`
      <section class="box has-text-link">
        <h4 class="title is-4 has-text-centered has-text-link">${this.race.title}</h4>
        <h5 class="subtitle is-5  has-text-centered has-text-link">${this.race.subtitle}</h5>

        <div class="tile is-ancestor">
          ${this.renderRaceLocation()} ${this.renderRaceDate()} ${this.renderRaceTime()}
        </div>

        <div class="tile is-ancestor">
          ${this.renderSwimDistance(distanceNumberFormat)} ${this.renderFirstRunDistance(distanceNumberFormat)}
          ${this.renderCyclingDistance(distanceNumberFormat)} ${this.renderRunDistance(distanceNumberFormat)}
          ${this.renderSecondRunDistance(distanceNumberFormat)}
        </div>
      </section>
    `;
  }

  /**
   * Renders the Race Location template.
   * The template is rendered only when the race data includes a location.
   *
   * @returns The Race Location template.
   */
  renderRaceLocation() {
    if (this.location) {
      return html`
        <div class="tile is-parent">
          <dl class="tile is-child has-text-centered">
            <dt class="heading">Local</dt>
            <dd class="title is-6">${this.location}</dd>
          </dl>
        </div>
      `;
    }
  }

  /**
   * Renders the Race Date template.
   * The template is rendered only when the race data includes a date.
   *
   * @returns The Race Date template
   */
  renderRaceDate() {
    if (this.race.scheduleDate || this.race.actualDate) {
      return html`
        <div class="tile is-parent">
          <dl class="tile is-child has-text-centered">
            <dt class="heading">${getUiMessage(uiMessagesKeys.date)}</dt>
            <dd class="title is-6">${this.race.actualDate ? this.race.actualDate : this.race.scheduleDate}</dd>
          </dl>
        </div>
      `;
    }
  }

  /**
   * Renders the Race Time template.
   * The template is rendered only when the race data includes a time.
   *
   * @returns The Race Time template.
   */
  renderRaceTime() {
    if (this.race.scheduleTime || this.race.actualTime) {
      return html`
        <div class="tile is-parent">
          <dl class="tile is-child has-text-centered">
            <dt class="heading">${getUiMessage(uiMessagesKeys.time)}</dt>
            <dd class="title is-6">${this.race.actualTime ? this.race.actualTime : this.race.scheduleTime}</dd>
          </dl>
        </div>
      `;
    }
  }

  /**
   * Renders the race's Swim Distance template.
   * The template is rendered only when the race data includes a swim distance.
   *
   * @param {NumberFormat} distanceNumberFormat The Number Format to be used for the race swim distance.
   * @returns The Swim Distance template.
   */
  renderSwimDistance(distanceNumberFormat) {
    if (this.race.swimDistance) {
      return html`
        <div class="tile is-parent">
          <dl class="tile is-child has-text-centered">
            <dt class="heading">${getUiMessage(uiMessagesKeys.swim)}</dt>
            <dd class="title is-6">${distanceNumberFormat.format(this.race.swimDistance)}</dd>
          </dl>
        </div>
      `;
    }
  }

  /**
   * Renders the race's First Run Distance template.
   * The template is rendered only when the race data includes a first run distance.
   *
   * @param {NumberFormat} distanceNumberFormat The Number Format to be used for the race first run distance.
   * @returns The First Run Distance template
   */
  renderFirstRunDistance(distanceNumberFormat) {
    if (this.race.firstRunDistance) {
      return html`
        <div class="tile is-parent">
          <dl class="tile is-child has-text-centered">
            <dt class="heading">${getUiMessage(uiMessagesKeys.firstRun)}</dt>
            <dd class="title is-6">${distanceNumberFormat.format(this.race.firstRunDistance)}</dd>
          </dl>
        </div>
      `;
    }
  }

  /**
   * Renders the race's Cycling Distance template.
   * The template is rendered only when the race data includes a cycling distance.
   *
   * @param {NumberFormat} distanceNumberFormat The Number Format to be used for the race cycling distance.
   * @returns The Cycling Distance template.
   */
  renderCyclingDistance(distanceNumberFormat) {
    if (this.race.cyclingDistance) {
      return html`
        <div class="tile is-parent">
          <dl class="tile is-child has-text-centered">
            <dt class="heading">${getUiMessage(uiMessagesKeys.cycling)}</dt>
            <dd class="title is-6">${distanceNumberFormat.format(this.race.cyclingDistance)}</dd>
          </dl>
        </div>
      `;
    }
  }

  /**
   * Renders the race's Run Distance template.
   * The template is rendered only when the race data includes a run distance.
   *
   * @param {NumberFormat} distanceNumberFormat The Number Format to be used for the race run distance.
   * @returns The race's run distance template.
   */
  renderRunDistance(distanceNumberFormat) {
    if (this.race.runDistance) {
      return html`
        <div class="tile is-parent">
          <dl class="tile is-child has-text-centered">
            <dt class="heading">${getUiMessage(uiMessagesKeys.run)}</dt>
            <dd class="title is-6">${distanceNumberFormat.format(this.race.runDistance)}</dd>
          </dl>
        </div>
      `;
    }
  }

  /**
   * Renders the race's Second Run Distance template.
   * The template is rendered only when the race data includes a second run distance.
   *
   * @param {NumberFormat} distanceNumberFormat The Number Format to be used for the race second run distance.
   * @returns The race's second run distance template.
   */
  renderSecondRunDistance(distanceNumberFormat) {
    if (this.race.secondRunDistance) {
      return html`
        <div class="tile is-parent">
          <dl class="tile is-child has-text-centered">
            <dt class="heading">${getUiMessage(uiMessagesKeys.secondRun)}</dt>
            <dd class="title is-6">${distanceNumberFormat.format(this.race.secondRunDistance)}</dd>
          </dl>
        </div>
      `;
    }
  }
}

customElements.define('results-header', ResultsHeader);
