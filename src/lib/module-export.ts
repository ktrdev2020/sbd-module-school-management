import { ModuleExportDescriptor } from '@sbd/dev-kit';

export const schoolManagementExports: ModuleExportDescriptor = {
  code: 'school-management',
  name: 'จัดการโรงเรียน',
  exports: [
    {
      type: 'editor',
      roles: ['AreaAdmin', 'SuperAdmin'],
      loadComponent: () =>
        import('./school-management/school-management').then(
          (m) => m.SchoolManagement
        ),
      label: 'จัดการโรงเรียน (Admin)',
    },
    {
      type: 'viewer',
      roles: ['AreaAdmin', 'SuperAdmin'],
      loadComponent: () =>
        import('./public/school-directory').then((m) => m.SchoolDirectory),
      label: 'ทำเนียบโรงเรียน',
    },
  ],
};
