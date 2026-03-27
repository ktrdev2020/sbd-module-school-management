import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { setPageTitle } from '@sbd/core/layout';
import { ConfirmDialogComponent } from '@sbd/shared';
import {
  SchoolApiService,
  SchoolListItemDto,
  SchoolRequest,
  SchoolSummaryDto,
} from '../services/school-api.service';

@Component({
  selector: 'lib-school-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './school-management.html',
})
export class SchoolManagement implements OnInit {
  private readonly store = inject(Store);
  private readonly api = inject(SchoolApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly schools = signal<SchoolListItemDto[]>([]);
  protected readonly summary = signal<SchoolSummaryDto | null>(null);
  protected readonly loading = signal(false);
  protected readonly showModal = signal(false);
  protected readonly showDeleteConfirm = signal(false);
  protected readonly editingSchool = signal<SchoolListItemDto | null>(null);
  protected readonly deleteTarget = signal<SchoolListItemDto | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly searchQuery = signal('');
  protected readonly filterDistrict = signal('');

  protected readonly filteredSchools = computed(() => {
    let list = this.schools();
    const q = this.searchQuery().toLowerCase();
    const d = this.filterDistrict();
    if (q) {
      list = list.filter(
        (s) =>
          s.nameTh.toLowerCase().includes(q) ||
          s.schoolCode.includes(q) ||
          (s.principal && s.principal.toLowerCase().includes(q))
      );
    }
    if (d) {
      list = list.filter((s) => s.districtName === d);
    }
    return list;
  });

  protected readonly stats = computed(() => {
    const s = this.summary();
    return {
      totalSchools: s?.totalSchools ?? 0,
      totalTeachers: s?.totalTeachers ?? 0,
      totalStudents: s?.totalStudents ?? 0,
      districts: s?.districts ?? [],
    };
  });

  protected form: FormGroup = this.fb.group({
    schoolCode: ['', Validators.required],
    nameTh: ['', Validators.required],
    nameEn: [''],
    areaId: [0, Validators.required],
    areaTypeId: [0, Validators.required],
    schoolCluster: [''],
    phone: [''],
    phone2: [''],
    email: [''],
    website: [''],
    taxId: [''],
    schoolType: [''],
    schoolLevel: [''],
    principal: [''],
    establishedDate: [''],
    latitude: [null],
    longitude: [null],
    studentCount: [null],
    teacherCount: [null],
    smisCode: [''],
    perCode: [''],
  });

  ngOnInit(): void {
    this.store.dispatch(setPageTitle({ title: 'จัดการโรงเรียน' }));
    this.loadSchools();
    this.loadSummary();
  }

  protected loadSchools(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (data) => {
        this.schools.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'ไม่สามารถโหลดข้อมูลโรงเรียนได้');
        this.loading.set(false);
      },
    });
  }

  protected loadSummary(): void {
    this.api.getSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: () => { /* summary is non-critical */ },
    });
  }

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  protected onFilterDistrict(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filterDistrict.set(value);
  }

  protected openAddModal(): void {
    this.editingSchool.set(null);
    // Pre-fill areaId and areaTypeId from first school if available
    const first = this.schools()[0];
    this.form.reset({
      schoolCode: '',
      nameTh: '',
      nameEn: '',
      areaId: first ? 1 : 0,
      areaTypeId: first ? 1 : 0,
      schoolCluster: '',
      phone: '',
      phone2: '',
      email: '',
      website: '',
      taxId: '',
      schoolType: '',
      schoolLevel: '',
      principal: '',
      establishedDate: '',
      latitude: null,
      longitude: null,
      studentCount: null,
      teacherCount: null,
      smisCode: '',
      perCode: '',
    });
    this.error.set(null);
    this.showModal.set(true);
  }

  protected openEditModal(school: SchoolListItemDto): void {
    this.editingSchool.set(school);
    this.error.set(null);
    // Load full detail for editing
    this.api.getById(school.id).subscribe({
      next: (detail) => {
        this.form.patchValue({
          schoolCode: detail.schoolCode,
          nameTh: detail.nameTh,
          nameEn: detail.nameEn ?? '',
          areaId: detail.areaId,
          areaTypeId: detail.areaTypeId,
          schoolCluster: detail.schoolCluster ?? '',
          phone: detail.phone ?? '',
          phone2: detail.phone2 ?? '',
          email: detail.email ?? '',
          website: detail.website ?? '',
          taxId: detail.taxId ?? '',
          schoolType: detail.schoolType ?? '',
          schoolLevel: detail.schoolLevel ?? '',
          principal: detail.principal ?? '',
          establishedDate: detail.establishedDate ?? '',
          latitude: detail.latitude,
          longitude: detail.longitude,
          studentCount: detail.studentCount,
          teacherCount: detail.teacherCount,
          smisCode: detail.smisCode ?? '',
          perCode: detail.perCode ?? '',
        });
        this.showModal.set(true);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'ไม่สามารถโหลดข้อมูลโรงเรียนได้');
      },
    });
  }

  protected closeModal(): void {
    this.showModal.set(false);
    this.editingSchool.set(null);
  }

  protected onSubmit(): void {
    if (!this.form.valid) return;

    const v = this.form.value;
    const request: SchoolRequest = {
      schoolCode: v.schoolCode,
      nameTh: v.nameTh,
      nameEn: v.nameEn || null,
      areaId: v.areaId,
      areaTypeId: v.areaTypeId,
      schoolCluster: v.schoolCluster || null,
      phone: v.phone || null,
      phone2: v.phone2 || null,
      email: v.email || null,
      website: v.website || null,
      taxId: v.taxId || null,
      schoolType: v.schoolType || null,
      schoolLevel: v.schoolLevel || null,
      principal: v.principal || null,
      establishedDate: v.establishedDate || null,
      latitude: v.latitude || null,
      longitude: v.longitude || null,
      studentCount: v.studentCount || null,
      teacherCount: v.teacherCount || null,
      smisCode: v.smisCode || null,
      perCode: v.perCode || null,
    };

    const editing = this.editingSchool();
    const obs = editing
      ? this.api.update(editing.id, request)
      : this.api.create(request);

    obs.subscribe({
      next: () => {
        this.closeModal();
        this.loadSchools();
        this.loadSummary();
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'บันทึกไม่สำเร็จ');
      },
    });
  }

  protected confirmDelete(school: SchoolListItemDto): void {
    this.deleteTarget.set(school);
    this.showDeleteConfirm.set(true);
  }

  protected onDeleteConfirmed(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.api.delete(target.id).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.deleteTarget.set(null);
        this.loadSchools();
        this.loadSummary();
      },
      error: (err) => {
        this.showDeleteConfirm.set(false);
        this.error.set(err?.error?.message ?? 'ลบไม่สำเร็จ');
      },
    });
  }

  protected onDeleteCancelled(): void {
    this.showDeleteConfirm.set(false);
    this.deleteTarget.set(null);
  }
}
