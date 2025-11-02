import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BookService, BookSummary } from '../services/book.service';
import { CategoryService } from '../services/category.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Author {
  name: string;
  avatar: string;
  bio: string;
  bookCount: number;
  totalReads: number;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  books: BookSummary[] = [];
  categories: Category[] = [];
  selectedCategory: string | null = null;
  currentSlide = 0;

  heroSlides: HeroSlide[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1530519696590-a11640ae14e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFkaW5nJTIwYm9va3MlMjBkcmVhbXl8ZW58MXx8fHwxNzYxOTEwODE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Plongez dans un univers où les mots prennent vie',
      description: 'Découvrez des milliers d\'histoires captivantes',
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1749527834101-5338e32d409b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbWFnaWNhbCUyMGF0bW9zcGhlcmV8ZW58MXx8fHwxNzYxOTEwODE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Entrez dans des mondes fantastiques',
      description: 'Magie, mystères et aventures vous attendent',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1581779124574-bc0da275e520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMHN1bnNldCUyMGNvdXBsZXxlbnwxfHx8MTc2MTg2MjIzOHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Des histoires qui touchent le cœur',
      description: 'Romance, passion et émotions',
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1633465253929-0580da0f72fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXlzdGVyaW91cyUyMGRyYW1hdGljfGVufDF8fHx8MTc2MTkxMDgxNnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Secrets, trahisons et mystères',
      description: 'Plongez dans l\'intrigue et le suspense',
    },
  ];

  categoryIcons: { [key: string]: string } = {
    'Romance': '💕',
    'Aventure': '⚔️',
    'Fantastique': '✨',
    'Thriller': '🔪',
    'Trahison': '😈',
    'Amitié': '🤝',
    'Développement personnel': '🌱',
    'Drame': '🎭',
    'Poésie': '🎶',
    'Mystère': '🔍',
    'Science-Fiction': '🚀',
    'Horreur': '👻',
  };

  constructor(
    private readonly booksApi: BookService,
    private readonly categoryService: CategoryService,
    private readonly router: Router,
  ) {}

  private autoSlideInterval?: any;

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  loadBooks(): void {
    this.booksApi.getBooks().subscribe((books) => {
      this.books = books;
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((catNames) => {
      this.categories = catNames.map((name, index) => ({
        id: String(index + 1),
        name,
        icon: this.categoryIcons[name] || '📚',
      }));
    });
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = this.selectedCategory === categoryId ? null : categoryId;
  }

  closeCategory(): void {
    this.selectedCategory = null;
  }

  onBookClick(bookId: string | number): void {
    this.router.navigate(['/tabs/book', bookId]);
  }

  getRecommendedBooks(): BookSummary[] {
    return this.books.slice(0, 6);
  }

  getPopularBooks(): BookSummary[] {
    return [...this.books]
      .sort((a, b) => (b.total_likes || 0) - (a.total_likes || 0))
      .slice(0, 6);
  }

  getRomanceBooks(): BookSummary[] {
    return this.books.filter((b) => b.category === 'Romance');
  }

  getDarkBooks(): BookSummary[] {
    return this.books.filter((b) => ['Trahison', 'Thriller', 'Mystère'].includes(b.category || ''));
  }

  getFilteredBooks(): BookSummary[] {
    if (!this.selectedCategory) return [];
    const category = this.categories.find((c) => c.id === this.selectedCategory);
    if (!category) return [];
    return this.books.filter((b) => b.category === category.name);
  }

  getSelectedCategoryName(): string {
    if (!this.selectedCategory) return '';
    const category = this.categories.find((c) => c.id === this.selectedCategory);
    return category ? category.name : '';
  }

  getSelectedCategoryIcon(): string {
    if (!this.selectedCategory) return '';
    const category = this.categories.find((c) => c.id === this.selectedCategory);
    return category ? category.icon : '';
  }

  getFeaturedAuthors(): Author[] {
    const authorMap = new Map<string, { name: string; books: BookSummary[]; totalReads: number }>();

    // Grouper les livres par auteur
    this.books.forEach((book) => {
      if (book.author) {
        const existing = authorMap.get(book.author);
        if (existing) {
          existing.books.push(book);
          existing.totalReads += book.total_likes || 0;
        } else {
          authorMap.set(book.author, {
            name: book.author,
            books: [book],
            totalReads: book.total_likes || 0,
          });
        }
      }
    });

    // Convertir en tableau d'auteurs et trier par popularité
    return Array.from(authorMap.values())
      .map((author) => ({
        name: author.name,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        bio: `Auteur de ${author.books.length} livre${author.books.length > 1 ? 's' : ''}`,
        bookCount: author.books.length,
        totalReads: author.totalReads,
      }))
      .sort((a, b) => b.totalReads - a.totalReads)
      .slice(0, 4);
  }

  formatReads(count: number): string {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`;
    }
    return String(count);
  }
}
