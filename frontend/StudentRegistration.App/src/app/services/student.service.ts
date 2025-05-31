import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Student, CreateStudentDto, UpdateStudentDto, PagedResultDto, StudentSearchRequest } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'https://localhost:7031/api/Students';

  constructor(private http: HttpClient) { }

  getStudents(request: StudentSearchRequest): Observable<PagedResultDto<Student>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('pageSize', request.pageSize.toString());

    if (request.searchTerm) {
      params = params.set('searchTerm', request.searchTerm);
    }
    if (request.sortBy) {
      params = params.set('sortBy', request.sortBy);
    }

    if (request.sortDescending !== undefined) {
      params = params.set('sortDescending', request.sortDescending.toString());
    }

    return this.http.get<PagedResultDto<Student>>(this.apiUrl, { params }).pipe(
      map(result => ({
        ...result,
        data: result.data.map(student => ({
          ...student,
          dateOfBirth: new Date(student.dateOfBirth)
        }))
      }))
    );
  }

  createStudent(student: CreateStudentDto): Observable<Student> {
    const studentData = {
      ...student,
      dateOfBirth: student.dateOfBirth.toISOString()
    };

    return this.http.post<Student>(this.apiUrl, studentData).pipe(
      map(result => ({
        ...result,
        dateOfBirth: new Date(result.dateOfBirth)
      }))
    );
  }

  updateStudent(id: number, student: UpdateStudentDto): Observable<Student> {
    const studentData = {
      ...student,
      dateOfBirth: student.dateOfBirth.toISOString()
    };

    return this.http.put<Student>(`${this.apiUrl}/${id}`, studentData).pipe(
      map(result => ({
        ...result,
        dateOfBirth: new Date(result.dateOfBirth)
      }))
    );
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}