import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-books',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class BookListComponent implements OnInit {
  public books: any[] = [];
  public category: string = '';
  public loading: boolean = false;
  public nextPageUrl: string | null = null;
  public searchForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({ searchQuery: [''] });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.books = [];
      this.nextPageUrl = null;
      this.fetchBooks();
    });

    this.searchForm.get('searchQuery')?.valueChanges.subscribe(query => {
      this.books = [];
      this.nextPageUrl = null;
      this.fetchBooks(query);
    });
  }

  public clearSearch() {
    this.searchForm.get('searchQuery')?.setValue('');
  }

  public goBack() {
    this.router.navigate(['/']);
  }

  private fetchBooks(searchQuery: string = '') {
    if (this.loading || this.nextPageUrl === null && this.books.length > 0) return;
    this.loading = true;
    let url = this.nextPageUrl
      ? this.nextPageUrl.replace('http://localhost:8005', 'http://skunkworks.ignitesol.com:8000')
      : `${this.category}`;
    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }
    this.bookService.getBooks(url).subscribe(
      response => {
        this.books = [...this.books, ...response.results];
        this.nextPageUrl = response.next;
        this.loading = false;
      },
      error => {
        console.error('Error fetching books', error);
        this.loading = false;
      }
    );
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

  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      this.fetchBooks();
    }
  }
}
