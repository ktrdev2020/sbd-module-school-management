import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '@sbd/core/config';

// ─── Interfaces ────────────────────────────────────────────

export interface SchoolDto {
  id: number;
  schoolCode: string;
  smisCode: string | null;
  perCode: string | null;
  nameTh: string;
  nameEn: string | null;
  areaId: number;
  areaName: string | null;
  areaTypeName: string | null;
  areaTypeId: number;
  schoolCluster: string | null;
  phone: string | null;
  phone2: string | null;
  email: string | null;
  website: string | null;
  taxId: string | null;
  schoolType: string | null;
  latitude: number | null;
  longitude: number | null;
  schoolSizeStd4: number | null;
  schoolSizeStd7: number | null;
  schoolSizeHr: number | null;
  schoolLevel: string | null;
  principal: string | null;
  establishedDate: string | null;
  isActive: boolean;
  studentCount: number | null;
  teacherCount: number | null;
  logoUrl: string | null;
  address: AddressDto | null;
}

export interface AddressDto {
  houseNumber: string | null;
  villageNo: string | null;
  villageName: string | null;
  road: string | null;
  soi: string | null;
  subDistrictName: string | null;
  districtName: string | null;
  provinceName: string | null;
  postalCode: string | null;
  fullAddress: string;
}

export interface SchoolListItemDto {
  id: number;
  schoolCode: string;
  nameTh: string;
  principal: string | null;
  phone: string | null;
  subDistrictName: string | null;
  districtName: string | null;
  schoolLevel: string | null;
  schoolType: string | null;
  isActive: boolean;
  studentCount: number | null;
  teacherCount: number | null;
}

export interface SchoolRequest {
  schoolCode: string;
  nameTh: string;
  nameEn: string | null;
  areaId: number;
  areaTypeId: number;
  schoolCluster: string | null;
  phone: string | null;
  phone2: string | null;
  email: string | null;
  website: string | null;
  taxId: string | null;
  schoolType: string | null;
  schoolLevel: string | null;
  principal: string | null;
  establishedDate: string | null;
  latitude: number | null;
  longitude: number | null;
  studentCount: number | null;
  teacherCount: number | null;
  smisCode: string | null;
  perCode: string | null;
}

export interface SchoolProfileUpdateRequest {
  phone: string | null;
  phone2: string | null;
  email: string | null;
  website: string | null;
  principal: string | null;
  logoUrl: string | null;
  studentCount: number | null;
  teacherCount: number | null;
}

export interface SchoolSummaryDto {
  totalSchools: number;
  totalTeachers: number;
  totalStudents: number;
  districts: string[];
}

// ─── Service ───────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class SchoolApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  private get baseUrl(): string {
    return `${this.config.apiUrl}/v1/school`;
  }

  // ── Admin CRUD ──

  getAll(params?: {
    search?: string;
    district?: string;
    subDistrict?: string;
    isActive?: boolean;
  }): Observable<SchoolListItemDto[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.district) httpParams = httpParams.set('district', params.district);
    if (params?.subDistrict)
      httpParams = httpParams.set('subDistrict', params.subDistrict);
    if (params?.isActive !== undefined)
      httpParams = httpParams.set('isActive', params.isActive.toString());
    return this.http.get<SchoolListItemDto[]>(this.baseUrl, {
      params: httpParams,
    });
  }

  getById(id: number): Observable<SchoolDto> {
    return this.http.get<SchoolDto>(`${this.baseUrl}/${id}`);
  }

  create(request: SchoolRequest): Observable<SchoolDto> {
    return this.http.post<SchoolDto>(this.baseUrl, request);
  }

  update(id: number, request: SchoolRequest): Observable<SchoolDto> {
    return this.http.put<SchoolDto>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ── School-Level Profile ──

  updateProfile(
    id: number,
    request: SchoolProfileUpdateRequest
  ): Observable<SchoolDto> {
    return this.http.put<SchoolDto>(`${this.baseUrl}/${id}/profile`, request);
  }

  // ── Public (no auth) ──

  getPublicList(params?: {
    search?: string;
    district?: string;
  }): Observable<SchoolListItemDto[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.district)
      httpParams = httpParams.set('district', params.district);
    return this.http.get<SchoolListItemDto[]>(`${this.baseUrl}/public`, {
      params: httpParams,
    });
  }

  getPublicById(id: number): Observable<SchoolDto> {
    return this.http.get<SchoolDto>(`${this.baseUrl}/public/${id}`);
  }

  getSummary(): Observable<SchoolSummaryDto> {
    return this.http.get<SchoolSummaryDto>(`${this.baseUrl}/public/summary`);
  }
}
