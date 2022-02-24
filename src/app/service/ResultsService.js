/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { getErrorMessage, errorMessagesKeys } from '../i18n/error-messages';
import { getEndpoint } from '../properties/endpoints';
import { Constants } from '../utils/Constants';

class ResultsService {
  /**
   * Fetchs the overall results for the given results reference
   * and sets results for each Age Group present.
   *
   * @param {String} resultsReference The results reference of the desired results.
   * @returns the results of the given results reference.
   */
  static async getResultsByReference(raceReference) {
    const apiData = await ResultsService.getResultsByReferenceFromJsonFile(raceReference);

    const results = new Map();

    if (apiData.error) {
      results.set('error', apiData.error);
      const errorResponse = { results: results };
      return errorResponse;
    }

    apiData.results = results.set('overall', apiData.results);
    const resultsAgeGroups = getAgeGroups(apiData.results.get('overall'));

    if (resultsAgeGroups.length <= 1) {
      return apiData;
    }

    /*
     * Get a clone of the API Results to be able to prepare a list of results for each Age Group present
     * The clone is made following the sugestion at https://stackoverflow.com/a/40283265
     */
    const overallResults = apiData.results.get('overall').map((result) => {
      return Object.assign({}, result);
    });

    resultsAgeGroups.forEach((ageGroup) => {
      const ageGroupResults = overallResults.filter((result) => {
        return result.ageGroup == ageGroup.shortName;
      });

      sortResultsByRank(ageGroupResults);
      setSequentialRank(ageGroupResults);
      calculateAgeGroupGaps(ageGroupResults);

      results.set(ageGroup.shortName, ageGroupResults);
    });

    return apiData;
  }

  /**
   * Fetchs, from a JSON file, the overall results for the given race reference.
   *
   * @param {String} raceReference The race reference of the desired results.
   * @returns The overall results of the given race reference.
   */
  static async getResultsByReferenceFromJsonFile(raceReference) {
    const url = getEndpoint('results', raceReference);

    return fetch(url, { cache: 'no-store' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return { error: getErrorMessage(errorMessagesKeys.resultsNotFound) };
        }
      })
      .catch(() => {
        return { error: getErrorMessage(errorMessagesKeys.networkError) };
      });
  }
}

/**
 * Gets the list ao all Age Groups on the overall results.
 *
 * @param {Array} overallResultsData The overall results of the race.
 * @returns The list of all Age Groups on the overall results.
 */
function getAgeGroups(overallResultsData) {
  const ageGroupsList = [];

  overallResultsData.forEach((result) => {
    const ageGroupObject = Constants.AGE_GROUPS.find((officialAgeGroup) => {
      return result.ageGroup == officialAgeGroup.shortName;
    });

    if (!ageGroupsList.includes(ageGroupObject)) {
      ageGroupsList.push(ageGroupObject);
    }
  });

  ageGroupsList.sort((a, b) => {
    return a.order - b.order;
  });

  return ageGroupsList;
}

/**
 * Sorts the given results by rank.
 *
 * @param {Array} resultsData Results array to be sorted by rank.
 */
function sortResultsByRank(resultsData) {
  resultsData.sort((a, b) => {
    return a.rank - b.rank;
  });
}

/**
 * Sets the given results rank with sequential numbers.
 *
 * @param {Array} resultsData Results array to be set with a sequential rank.
 */
function setSequentialRank(resultsData) {
  let rank = 1;
  resultsData.forEach((result) => {
    if (parseInt(result.rank)) {
      result.rank = rank;
      rank = rank + 1;
    }
  });
}

/**
 * Sets the correct time gap in the Age Groups results.
 *
 * @param {Array} resultsData Results array to be set with the correct time gap for the Age Groups results.
 */
function calculateAgeGroupGaps(resultsData) {
  const winnerTotal = new Date(Date.parse('1984-08-15T' + resultsData[0].total + 'Z'));
  const hourInMiliseconds = 60 * 60 * 1000;
  const minuteInMiliseconds = 60 * 1000;

  resultsData.map((result) => {
    const resultTotalTime = Date.parse('1984-08-15T' + result.total + 'Z');
    if (resultTotalTime) {
      const gapMilisecons = new Date(resultTotalTime) - winnerTotal;

      const numberFormart = new Intl.NumberFormat('pt-PT', { minimumIntegerDigits: 2 });
      const diffHours = numberFormart.format(Math.floor(gapMilisecons / hourInMiliseconds));
      const diffMinutes = numberFormart.format(Math.floor(gapMilisecons / minuteInMiliseconds) - diffHours * 60);
      const diffSeconds = numberFormart.format(Math.floor(gapMilisecons / 1000) - diffHours * 3600 - diffMinutes * 60);

      result.gap = diffHours.concat(':', diffMinutes, ':', diffSeconds);
    }
  });
}

export { ResultsService };
