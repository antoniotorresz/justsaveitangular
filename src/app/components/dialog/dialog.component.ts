import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnInit {

  postForm: FormGroup = new FormGroup({});
  filename: string = 'Nothing selected';
  selectedFile: File | null = null;
  filepath: string = '';
  http = inject(HttpClient);
  HOST: string = 'http://192.168.1.65:8080';
  createButtonClass: string = 'button is-success footer-button';
  SUCCESS_MESSAGE: string = '😎🤣 Post created succesfully! 🤗😇';

  constructor(private mdRef: MatDialogRef<DialogComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      media: ['',]
    });
  }

  closeDialog(): void {
    this.postForm.reset();
    this.mdRef.close();
  }


  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.filename = this.selectedFile.name;
    }
  }
  async savePost() {
    let post = {
      title: this.postForm.value.title,
      contentOfPost: this.postForm.value.body,
      postingDate: new Date().toISOString(),
      media: ''
    };
    if (this.selectedFile) {
      try {
        this.createButtonClass += ' is-loading';
        const formData = new FormData();
        const resizedFile = await this.resizeImage(this.selectedFile, 800);
        formData.append('file', resizedFile);
        this.http.post(this.HOST + '/api/v1/post/fileUpload', formData)
          .subscribe((response: any) => {
            this.filepath = response.path;
            post.media = this.filepath;
            this.http.post(this.HOST + '/api/v1/post/', post)
              .subscribe((response: any) => {
                alert(this.SUCCESS_MESSAGE);
                this.postForm.reset();
                this.mdRef.close();
                window.location.reload();
              });
          });
      } catch (error) {
        alert('Something went wrong uploading your image, please try again later.\n' + error);
      }
    } else {
      this.http.post(this.HOST + '/api/v1/post/', post)
        .subscribe((response: any) => {
          alert(this.SUCCESS_MESSAGE);
          this.postForm.reset();
          this.mdRef.close();
          window.location.reload();
        });
    }
  }

  resizeImage(file: File, maxDimension: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Could not create canvas context'));
          return;
        }

        let { width, height } = image;
        if (width > height) {
          if (width > maxDimension) {
            height *= maxDimension / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width *= maxDimension / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(blob => {
          if (!blob) {
            reject(new Error('Could not create blob'));
            return;
          }
          const resizedFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });
          resolve(resizedFile);
        }, 'image/jpeg');
      };
      image.onerror = reject;
    });
  }
}