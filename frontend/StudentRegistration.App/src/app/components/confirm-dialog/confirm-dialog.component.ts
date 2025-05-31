import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string,
            message: string,
            type: 'confirm' | 'alert',
            alertType?: 'success' | 'error'
        }
    ) { }

    getIcon(): string {
        if (this.data.type === 'confirm') return 'warning';
        return this.data.alertType === 'success' ? 'check_circle' : 'error';
    }

    getIconColor(): string {
        if (this.data.type === 'confirm') return 'warn';
        return this.data.alertType === 'success' ? 'primary' : 'warn';
    }
    getIconClass(): string {
        if (this.data.type === 'confirm') return '';
        return this.data.alertType === 'success' ? 'success-icon' : 'error-icon';
    }

    getButtonClass(): string {
        return this.data.alertType === 'success' ? 'success-button' : 'error-button';
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onOk(): void {
        this.dialogRef.close();
    }
}