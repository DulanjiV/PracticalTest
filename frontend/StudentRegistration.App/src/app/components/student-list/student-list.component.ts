import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Student, PagedResultDto, StudentSearchRequest } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { StudentFormComponent } from '../student-form/student-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  selectedStudent: Student | null = null;
  selectedStudentIndex: number = -1;
  displayedColumns: string[] = ['firstName', 'lastName', 'mobile', 'email', 'nic'];
  searchTerm: string = '';
  loading: boolean = false;

  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  sortBy: string = '';
  sortDescending: boolean = false;

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    const request: StudentSearchRequest = {
      searchTerm: this.searchTerm || undefined,
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortDescending: this.sortDescending
    };

    this.studentService.getStudents(request).subscribe({
      next: (result: PagedResultDto<Student>) => {
        this.students = result.data;
        this.totalRecords = result.totalRecords;
        this.loading = false;

        if (this.selectedStudent) {
          const foundIndex = this.students.findIndex(s => s.id === this.selectedStudent!.id);
          if (foundIndex === -1) {
            this.selectedStudent = null;
            this.selectedStudentIndex = -1;
          } else {
            this.selectedStudentIndex = foundIndex;
          }
        }
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.showAlert('Error', 'Error loading students. Please try again.', 'error');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.selectedStudent = null;
    this.selectedStudentIndex = -1;
    this.loadStudents();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadStudents();
  }

  selectStudent(student: Student, index: number): void {
    if (this.selectedStudent && this.selectedStudent.id === student.id) {
      this.selectedStudent = null;
      this.selectedStudentIndex = -1;
    } else {
      this.selectedStudent = student;
      this.selectedStudentIndex = index;
    }
  }

  navigateStudent(direction: 'prev' | 'next'): void {
    if (!this.selectedStudent) return;

    let newIndex = this.selectedStudentIndex;

    if (direction === 'prev' && newIndex > 0) {
      newIndex--;
    } else if (direction === 'next' && newIndex < this.students.length - 1) {
      newIndex++;
    }

    if (newIndex !== this.selectedStudentIndex) {
      this.selectedStudent = this.students[newIndex];
      this.selectedStudentIndex = newIndex;
    }
  }

  addStudent(): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '500px',
      data: { student: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents();
        this.showAlert('Success', 'Student created successfully!', 'success');
      }
    });
  }

  editStudent(): void {
    if (!this.selectedStudent) return;

    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '500px',
      data: { student: this.selectedStudent, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedStudent = result;
        const index = this.students.findIndex(s => s.id === result.id);
        if (index !== -1) {
          this.students[index] = result;
          this.selectedStudentIndex = index; 
        }
        this.students = [...this.students];
        this.showAlert('Success', 'Student updated successfully!', 'success');
      }
    });
  }

  deleteStudent(): void {
    if (!this.selectedStudent) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${this.selectedStudent.firstName} ${this.selectedStudent.lastName}?`,
        type: 'confirm'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.selectedStudent && this.selectedStudent.id) {
        this.studentService.deleteStudent(this.selectedStudent.id).subscribe({
          next: () => {
            this.showAlert('Success', 'Student deleted successfully!', 'success');
            this.selectedStudent = null;
            this.selectedStudentIndex = -1;
            this.loadStudents();
          },
          error: (error) => {
            console.error('Error deleting student:', error);
            this.showAlert('Error', 'Error deleting student. Please try again.', 'error');
            this.loading = false;
          }
        });
      }
    });
  }

  private showAlert(title: string, message: string, alertType: 'success' | 'error'): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: title,
        message: message,
        type: 'alert',
        alertType: alertType
      }
    });
  }

isRowSelected(student: Student): boolean {
    return this.selectedStudent?.id === student.id;
  }

  sortData(column: string): void {
    if (this.sortBy === column) {
      this.sortDescending = !this.sortDescending;
    } else {
      this.sortBy = column;
      this.sortDescending = false;
    }
    this.currentPage = 1;
    this.loadStudents();
  }

  getSortIcon(column: string): string {
    if (this.sortBy !== column) return 'unfold_more';
    return this.sortDescending ? 'keyboard_arrow_down' : 'keyboard_arrow_up';
  }
}