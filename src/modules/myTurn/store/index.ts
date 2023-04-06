import convertTimeStampToFormattedTime from '@/common/utils/convertTimeStampToFormattedTime';
import convertTimeStampToPersianDate from '@/common/utils/convertTimeStampToPersianDate';
import { create } from 'zustand';

interface BooksStore {
  books: any[];
  addBooks: (books: any[]) => void;
  setBooks: (books: any[]) => void;
  removeBook: ({ bookId }: { bookId: string }) => void;
  moveBook: ({ bookId, from }: { bookId: string; from: number }) => void;
}

export const useBookStore = create<BooksStore>(set => ({
  books: [],
  addBooks: books =>
    set(state => ({
      books: [...state.books, ...books],
    })),
  setBooks: books =>
    set(() => ({
      books,
    })),
  removeBook: ({ bookId }) => {
    set(state => ({
      books: state.books.map(book => (book.book_id === bookId ? { ...book, delete: 1 } : book)),
    }));
  },
  moveBook: ({ bookId, from }) => {
    const timeString = `${convertTimeStampToPersianDate(from)} ${convertTimeStampToFormattedTime(from)}`;
    set(state => ({
      books: state.books.map(book => (book.book_id === bookId ? { ...book, from, book_time_string: timeString } : book)),
    }));
  },
}));
