import create from "zustand";

interface BooksStore {
  books: any[];
  addBooks: (books: any[]) => void;
  setBooks: (books: any[]) => void;
  removeBook: ({ bookId }: { bookId: string }) => void;
}

export const useBookStore = create<BooksStore>((set) => ({
  books: [],
  addBooks: (books) =>
    set((state) => ({
      books: [...state.books, ...books],
    })),
  setBooks: (books) =>
    set(() => ({
      books,
    })),
  removeBook: ({ bookId }) => {
    set((state) => ({
      books: state.books.filter((book) => book.book_id !== bookId),
    }));
  },
}));
