import { createDevHostConfig } from '@sbd/dev-kit';
import { schoolManagementDevRoutes } from '../lib/lib.routes';
import { schoolManagementExports } from '../lib/module-export';

export const appConfig = createDevHostConfig({
  routes: schoolManagementDevRoutes,
  menuItems: [
    { id: 'school-management', label: 'จัดการโรงเรียน', icon: 'fas fa-school', route: '/' },
  ],
  pageTitle: 'จัดการโรงเรียน',
  moduleExport: schoolManagementExports,
  contextOverrides: {
    AreaAdmin: { areaId: 'area-001' },
    SuperAdmin: {},
  },
});
