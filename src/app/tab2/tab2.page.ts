import { Component, OnInit } from '@angular/core';
import { BookService, BookSummary } from '../services/book.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Category {
  id: number;
  name: string;
  icon?: string;
}

interface CategoryWithBooks {
  category: Category;
  books: BookSummary[];
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  categoriesWithBooks: CategoryWithBooks[] = [];
  recommendedBooks: BookSummary[] = [];
  allBooks: BookSummary[] = [];
  filteredAllBooks: BookSummary[] = [];
  searchQuery: string = '';
  originalCategoriesWithBooks: CategoryWithBooks[] = [];
  originalRecommendedBooks: BookSummary[] = [];

  constructor(
    private readonly booksApi: BookService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    // Charger toutes les catégories
    this.http.get<Category[]>(`${environment.apiUrl}/categories`).subscribe((categories) => {
      // Prendre les 4 premières catégories
      const selectedCategories = categories.slice(0, 4);
      
      // Compter les requêtes pour savoir quand tout est chargé
      let loadedCount = 0;
      const totalToLoad = selectedCategories.length;
      
      // Charger les livres pour chaque catégorie
      selectedCategories.forEach((category) => {
        this.http
          .get<{ category: Category; books: BookSummary[] }>(
            `${environment.apiUrl}/categories/${category.name}`
          )
          .subscribe((response) => {
            this.categoriesWithBooks.push({
              category: response.category,
              books: response.books.slice(0, 5), // Limiter à 5 livres par catégorie pour le slide
            });
            loadedCount++;
            
            // Une fois toutes les catégories chargées, sauvegarder les données originales
            if (loadedCount === totalToLoad) {
              this.originalCategoriesWithBooks = JSON.parse(JSON.stringify(this.categoriesWithBooks));
            }
          });
      });
    });

    // Charger les livres recommandés (par exemple, les mieux notés)
    this.booksApi.getBooks().subscribe((res) => {
      this.allBooks = Array.isArray(res) ? res : [];
      this.filteredAllBooks = this.allBooks;
      // Les 6 livres les mieux notés comme recommandés
      this.recommendedBooks = this.allBooks
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
      this.originalRecommendedBooks = JSON.parse(JSON.stringify(this.recommendedBooks));
    });
  }

  onSearchChange(event: any): void {
    const query = event.target.value || '';
    this.searchQuery = query;
    
    if (!query || query.trim() === '') {
      // Si la recherche est vide, afficher tous les livres
      this.filteredAllBooks = this.allBooks;
      this.recommendedBooks = JSON.parse(JSON.stringify(this.originalRecommendedBooks));
      this.categoriesWithBooks = JSON.parse(JSON.stringify(this.originalCategoriesWithBooks));
      return;
    }

    const searchLower = query.toLowerCase().trim();

    // Filtrer les livres recommandés
    this.recommendedBooks = this.originalRecommendedBooks.filter(book =>
      book.title?.toLowerCase().includes(searchLower) ||
      book.author?.toLowerCase().includes(searchLower) ||
      book.category?.toLowerCase().includes(searchLower)
    );

    // Filtrer tous les livres
    this.filteredAllBooks = this.allBooks.filter(book =>
      book.title?.toLowerCase().includes(searchLower) ||
      book.author?.toLowerCase().includes(searchLower) ||
      book.category?.toLowerCase().includes(searchLower)
    );

    // Filtrer les catégories
    this.categoriesWithBooks = this.originalCategoriesWithBooks.map(catData => ({
      category: catData.category,
      books: catData.books.filter(book =>
        book.title?.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower)
      )
    })).filter(catData => catData.books.length > 0);
  }
}
