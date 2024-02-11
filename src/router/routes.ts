import {Router} from 'framework7/types';

import HomePage from '../pages/home.vue';
import BookmarksPage from '../pages/bookmarks.vue';
import SettingsPage from '../pages/settings.vue';

const routes: Array<Router.RouteParameters> = [
    {
        path: '/home/',
        component: HomePage,
    },
    {
        path: '/bookmarks/',
        component: BookmarksPage,
    }, {
        path: '/settings/',
        component: SettingsPage,
    }
];

export default routes;
