import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgOptimizedImage],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  HOST: string = 'http://localhost:8080';
  posts: any[] = [];
  @Input() searchTerm: string = '';
  filteredPosts: any[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>(this.HOST + '/api/v1/post/').subscribe((response) => {
      this.posts = response;
    });
  }


  /*
  
  @Input() searchTerm: string;
  posts: any[] = [];
  filteredPosts: any[] = [];

  // other properties...

  ngOnInit(): void {
    this.http.get<any>(this.HOST + '/api/v1/post/').subscribe((response) => {
      this.posts = response;
      this.filterPosts();
    });
  }

  ngOnChanges(): void {
    this.filterPosts();
  }

  filterPosts(): void {
    if (this.searchTerm) {
      this.filteredPosts = this.posts.filter(post => post.title.includes(this.searchTerm) || post.content.includes(this.searchTerm));
    } else {
      this.filteredPosts = this.posts;
    }
  }
  
  */
}
