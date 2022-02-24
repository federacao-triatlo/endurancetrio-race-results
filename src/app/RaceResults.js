/*!
 * EnduranceTrio Race Results
 * Copyright 2021 Ricardo do Canto
 * Licensed under MIT (https://github.com/EnduranceCode/endurancetrio-race-results/blob/master/LICENSE)
 */

import { Router } from '@vaadin/router';

import './components/events-list/EventsList';
import './components/event-data/EventData';

const baseUrl = window.location.pathname;
const app = document.getElementById('race-results');

export const router = new Router(app, { baseUrl: baseUrl });

router.setRoutes([
  { path: '/', component: 'events-list' },
  { path: '/:eventReference', component: 'event-data' },
  { path: '(.*)', component: 'events-list' },
]);
