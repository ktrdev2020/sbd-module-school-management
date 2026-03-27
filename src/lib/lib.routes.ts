import { Route } from '@angular/router';
import { scenarioViewRoute } from '@sbd/dev-kit';
import { SchoolManagement } from './school-management/school-management';
import { SchoolDirectory } from './public/school-directory';
import { SchoolDetail } from './public/school-detail';
import { schoolManagementExports } from './module-export';

// === DEV ROUTES ===
// Used with `npm start` — Scenario Switcher auto-toggles components
export const schoolManagementDevRoutes: Route[] = [
  {
    path: '',
    children: [
      scenarioViewRoute({
        path: '',
        descriptor: schoolManagementExports,
      }),
    ],
  },
];

// === PRODUCTION ROUTES ===
// Imported by main app route files
export const schoolManagementRoutes: Route[] = [
  { path: '', component: SchoolManagement },
];

export const schoolPublicRoutes: Route[] = [
  { path: '', component: SchoolDirectory },
  { path: ':id', component: SchoolDetail },
];
