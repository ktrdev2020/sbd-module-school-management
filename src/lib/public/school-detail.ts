import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SchoolApiService, SchoolDto } from '../services/school-api.service';

@Component({
  selector: 'lib-school-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './school-detail.html',
})
export class SchoolDetail implements OnInit {
  private readonly api = inject(SchoolApiService);
  private readonly route = inject(ActivatedRoute);

  protected readonly school = signal<SchoolDto | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadSchool(id);
  }

  private loadSchool(id: number): void {
    this.loading.set(true);
    this.api.getPublicById(id).subscribe({
      next: (data) => {
        this.school.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'ไม่พบข้อมูลโรงเรียน');
        this.loading.set(false);
      },
    });
  }
}
