import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Student, CreateStudentDto, UpdateStudentDto } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
  selectedFile: File | null = null;
  selectedFileName: string = '';
  imagePreviewUrl: string = '';
  currentImageUrl: string = '';
  maxFileSize: number = 5 * 1024 * 1024;
  allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<StudentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { student: Student | null, isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
    this.studentForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.student) {
      this.populateForm(this.data.student);
      if (this.data.student.profileImageBase64 && this.data.student.imageContentType) {
        this.currentImageUrl = `data:${this.data.student.imageContentType};base64,${this.data.student.profileImageBase64}`;
        this.imagePreviewUrl = this.currentImageUrl;
      }
    }
  }

  onMobileInput(event: any): void {
    const input = event.target;
    const value = input.value;
    const number = value.replace(/[^+0-9]/g, '');
    let finalValue = number;

    if (number.includes('+')) {
      const plusIndex = number.indexOf('+');
      if (plusIndex === 0) {
        finalValue = '+' + number.substring(1).replace(/\+/g, '');
      } else {
        finalValue = number.replace(/\+/g, '');
      }
    }
    if (finalValue !== value) {
      this.studentForm.get('mobile')?.setValue(finalValue);
      input.value = finalValue;
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      mobile: ['', [Validators.required, Validators.maxLength(16)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      nic: ['', [Validators.required, Validators.maxLength(12)]],
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!this.allowedTypes.includes(file.type)) {
        this.showAlert('Invalid File Type', 'Please select a valid image file (JPEG, PNG, GIF)', 'error');
        return;
      }

      if (file.size > this.maxFileSize) {
        this.showAlert('File Too Large', 'File size must be less than 5MB', 'error');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.imagePreviewUrl = '';
    this.currentImageUrl = '';

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getImageDisplayName(): string {
    if (this.selectedFileName) return this.selectedFileName;
    if (this.currentImageUrl) return 'Current image';
    return '';
  }

  hasImage(): boolean {
    return !!(this.imagePreviewUrl || this.currentImageUrl);
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async onSubmit(): Promise<void> {
    const formValue = this.studentForm.value;
    if (formValue.dateOfBirth >= this.today) {
      this.showAlert('Invalid Date', 'Date of Birth cannot be in the future.', 'error');
      return;
    }
    if (!this.validateNicWithDobSimple(formValue.nic, formValue.dateOfBirth)) {
      this.showAlert('NIC Mismatch', 'The NIC number does not match the date of birth year.', 'error');
      return;
    }
    if (this.studentForm.valid) {
      this.loading = true;
      const formValue = this.studentForm.value;

      let profileImageBase64: string | undefined;
      let imageContentType: string | undefined;

      if (this.selectedFile) {
        try {
          profileImageBase64 = await this.convertFileToBase64(this.selectedFile);
          imageContentType = this.selectedFile.type;
        } catch (error) {
          console.error('Error processing image:', error);
          this.showAlert('Image Processing Error', 'Error processing image. Please try again.', 'error');
          this.loading = false;
          return;
        }
      } else if (this.currentImageUrl && !this.selectedFile) {
        if (this.data.student?.profileImageBase64) {
          profileImageBase64 = this.data.student.profileImageBase64;
          imageContentType = this.data.student.imageContentType;
        }
      }

      const studentData = {
        ...formValue,
        dateOfBirth: formValue.dateOfBirth,
        profileImageBase64,
        imageContentType
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
            this.showAlert('Update Failed', error?.error?.message, 'error');
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
            this.showAlert('Creation Failed', error?.error?.message, 'error');
            this.loading = false;
          }
        });
      }
    }
  }

  private validateNicWithDobSimple(nic: string, dateOfBirth: Date): boolean {

    const dobYear = new Date(dateOfBirth).getFullYear();
    let nicYear = 0;

    if (nic.length === 10) {
      const year = nic.substring(0, 2);
      const year2Digit = parseInt(year);

      if (year2Digit >= 0 && year2Digit <= 25) {
        nicYear = 2000 + year2Digit;
      } else {
        nicYear = 1900 + year2Digit;
      }

    } else if (nic.length === 12) {
      nicYear = parseInt(nic.substring(0, 4));

    } else {
      return true;
    }

    return nicYear === dobYear;
  }

  onCancel(): void {
    this.dialogRef.close();
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
}