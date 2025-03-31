import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-books',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  imports: [CommonModule,ReactiveFormsModule]
})
export class BookListComponent implements OnInit {
  public books: any[] = [];
  public category: string = '';
  public loading: boolean = true; 
  public searchForm: FormGroup;

  constructor(private route: ActivatedRoute, private bookService: BookService, private router: Router, private fb: FormBuilder ) {
    this.searchForm = this.fb.group({
      searchQuery: [''] 
    });
  }

  ngOnInit() {
    this.searchForm = this.fb.group({ searchQuery: [''] }); 
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.fetchBooks();
    });
    this.searchForm.get('searchQuery')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged()) 
      .subscribe(query => {
        this.fetchBooks(query);
      });
  }

  public goBack() {
    this.router.navigate(['/']); 
  }

  private fetchBooks(searchQuery: string = '') {
    this.loading = true;
    this.bookService.getBooks(this.category, searchQuery).subscribe(response => {
      this.books = response.results;
      this.loading = false; 
    }, () => {
      this.loading = false;
    });
  }

  public openBook(book: any) {
    const formats = book.formats;
    const formatOrder = ['text/html', 'application/pdf', 'text/plain'];
    for (let format of formatOrder) {
      if (formats[format]) {
        window.open(formats[format], '_blank');
        return;
      }
    }
      alert('No viewable version available');
  }
}
