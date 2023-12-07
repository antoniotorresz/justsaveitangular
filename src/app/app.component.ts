import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PostComponent } from './components/post/post.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DialogComponent, PostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isDialogOpen = false;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.isDialogOpen = false;
  }
openDialog(): void {
  if (!this.isDialogOpen) {
    this.isDialogOpen = true;
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {},

      panelClass: 'dialog-container' // Add a custom CSS class for the dialog container
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isDialogOpen = false;
    });
  }
}
  closeDialog(): void {
    this.isDialogOpen = false;
  }
}
