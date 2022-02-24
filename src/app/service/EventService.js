/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { getEndpoint } from '../properties/endpoints';
import { getErrorMessage, errorMessagesKeys } from '../i18n/error-messages';

class EventService {
  /**
   * Returns the event with the given reference.
   *
   * @param {String} eventReference reference of the event to fetch.
   * @returns the desired event.
   */
  static async getEventByReference(eventReference) {
    const result = await fetch(getEndpoint('events', eventReference), { cache: 'no-store' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return { error: getErrorMessage(errorMessagesKeys.eventNotFound) };
        }
      })
      .catch(() => {
        return { error: getErrorMessage(errorMessagesKeys.networkError) };
      });

    return result;
  }

  /**
   * Fetchs all events that are stored on the server.
   *
   * @returns the all events stored on the server.
   */
  static async getEvents() {
    return fetch(getEndpoint('events', 'events'), { cache: 'no-store' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return { error: getErrorMessage(errorMessagesKeys.eventsListNotFound) };
        }
      })
      .catch(() => {
        return { error: getErrorMessage(errorMessagesKeys.networkError) };
      });
  }
}

export { EventService };
