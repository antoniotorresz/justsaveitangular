import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  constructor(private mdRef: MatDialogRef<DialogComponent>) { }
  closeDialog(): void {
    this.mdRef.close();
  }
}
