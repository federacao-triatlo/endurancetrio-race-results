/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { LitElement, html, css, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

class MdIcon extends LitElement {
  static styles = css`
    svg {
      display: inline-block;
      fill: currentColor;
      height: 1em;
      margin: auto;
      vertical-align: middle;
      width: 1em;
    }
  `;

  static properties = {
    iconSize: { attribute: 'icon-size' },
    path: {},
  };

  constructor() {
    super();
    this.iconSize = '1x';
    this.path = svg``;
  }

  render() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style=${styleMap(this.getIconStyleSize(this.iconSize))}
      >
        <path d=${this.path} />
      </svg>
    `;
  }

  /**
   * Gets the style for the icon size based on the icon-size attribute value.
   *
   * @param {String} iconSize The icons-size attribute value.
   * @returns The style for the icon size.
   */
  getIconStyleSize(iconSize) {
    switch (iconSize) {
      case '4x':
        return { height: '4em', width: '4em' };
      case '3x':
        return { height: '3em', width: '3em' };
      case '2x':
        return { height: '2em', width: '2em' };
      case '1x':
      default:
        return { height: '1em', width: '1em' };
    }
  }
}

customElements.define('md-icon', MdIcon);
