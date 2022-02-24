/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css } from 'lit';

import { mdiArrowUpDownBold } from '@mdi/js';
import { mdiArrowUpBold } from '@mdi/js';
import { mdiArrowDownBold } from '@mdi/js';

import '../md-icon/MdIcon';

class TableHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      white-space: nowrap;
    }

    :host([hidden]) {
      display: none;
    }
  `;

  static properties = {
    label: { type: String },
    sortingIndex: { attribute: 'sorting-index', type: Number },
  };

  constructor() {
    super();
    this.label = '';
    this.sortingIndex = 0;
  }

  render() {
    return html` <span>${this.label}</span><md-icon path=${getPath(this.sortingIndex)}></md-icon> `;
  }
}

/**
 * Gets the d attribute for the SVG sorting icon for the given sorting index.
 *
 * @param {String} sortingIndex The colum's sorting index.
 * @returns The pasth d attribute of the SVG sorting icon.
 */
function getPath(sortingIndex) {
  switch (sortingIndex) {
    case 1:
      return mdiArrowUpBold;
    case -1:
      return mdiArrowDownBold;
    case 0:
    default:
      return mdiArrowUpDownBold;
  }
}

customElements.define('table-header', TableHeader);
