import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  SchoolApiService,
  SchoolListItemDto,
  SchoolSummaryDto,
} from '../services/school-api.service';

@Component({
  selector: 'lib-school-directory',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './school-directory.html',
})
export class SchoolDirectory implements OnInit {
  private readonly api = inject(SchoolApiService);

  protected readonly schools = signal<SchoolListItemDto[]>([]);
  protected readonly summary = signal<SchoolSummaryDto | null>(null);
  protected readonly loading = signal(false);
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
          s.schoolCode.includes(q)
      );
    }
    if (d) {
      list = list.filter((s) => s.districtName === d);
    }
    return list;
  });

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.api.getSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: () => { /* summary is non-critical */ },
    });
    this.api.getPublicList().subscribe({
      next: (data) => {
        this.schools.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected onFilterDistrict(event: Event): void {
    this.filterDistrict.set((event.target as HTMLSelectElement).value);
  }
}
