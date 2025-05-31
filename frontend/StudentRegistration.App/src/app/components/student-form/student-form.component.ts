import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Student, CreateStudentDto, UpdateStudentDto } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  isEdit: boolean;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private dialogRef: MatDialogRef<StudentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { student: Student | null, isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
    this.studentForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.student) {
      this.populateForm(this.data.student);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      mobile: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      nic: ['', [Validators.required, Validators.maxLength(20)]],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.maxLength(500)]
    });
  }

  private populateForm(student: Student): void {
    this.studentForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      mobile: student.mobile,
      email: student.email,
      nic: student.nic,
      dateOfBirth: student.dateOfBirth,
      address: student.address
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.loading = true;
      const formValue = this.studentForm.value;

      const studentData = {
        ...formValue,
        dateOfBirth: formValue.dateOfBirth
      };

      if (this.isEdit && this.data.student && this.data.student.id) {
        const updateData: UpdateStudentDto = studentData;
        this.studentService.updateStudent(this.data.student.id, updateData).subscribe({
          next: (result) => {
            this.loading = false;
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Error updating student:', error);
            this.loading = false;
          }
        });
      } else {
        const createData: CreateStudentDto = studentData;
        this.studentService.createStudent(createData).subscribe({
          next: (result) => {
            this.loading = false;
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Error creating student:', error);
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}