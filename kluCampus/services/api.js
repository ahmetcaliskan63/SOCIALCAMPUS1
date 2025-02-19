import AsyncStorage from "@react-native-async-storage/async-storage";

// API URL'ini güncelleyin - backend URL'inizi buraya yazın
const BASE_URL = "https://socialcampus-production.up.railway.app/api"; // /api ekledik

// Ortak headers
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Kullanıcı işlemleri
export const userService = {
  createUser: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        // endpoint'i değiştirdik
        method: "POST",
        headers,
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Kullanıcı oluşturma hatası:", error);
      throw error;
    }
  },

  getUser: async (userId) => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (!storedData) {
        throw new Error("Kullanıcı verisi bulunamadı");
      }

      return JSON.parse(storedData);
    } catch (error) {
      console.error("Kullanıcı bilgisi alma hatası:", error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${BASE_URL}/kullanici/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  },

  getUsersByFaculty: async (faculty) => {
    try {
      const response = await fetch(
        `${BASE_URL}/kullanicilar/fakulte/${faculty}`
      );
      return await response.json();
    } catch (error) {
      console.error("Get users by faculty error:", error);
      throw error;
    }
  },
};

// Kitap işlemleri
export const bookService = {
  getAllBooks: async () => {
    try {
      const cachedBooks = await AsyncStorage.getItem("cached_books");
      if (cachedBooks) {
        return JSON.parse(cachedBooks);
      }
      return [];
    } catch (error) {
      console.error("Kitap listesi alma hatası:", error);
      return [];
    }
  },

  createBook: async (bookData) => {
    try {
      // Önce mevcut kitapları al
      let books = [];
      try {
        const cachedBooks = await AsyncStorage.getItem("cached_books");
        if (cachedBooks) {
          books = JSON.parse(cachedBooks);
        }
      } catch (e) {
        console.log("Cache okuma hatası:", e);
      }

      // Yeni kitap verisi
      const newBook = {
        ...bookData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };

      // Kitabı listeye ekle
      books.unshift(newBook);

      // Cache'i güncelle
      await AsyncStorage.setItem("cached_books", JSON.stringify(books));

      return newBook;
    } catch (error) {
      console.error("Kitap oluşturma hatası:", error);
      throw error;
    }
  },

  getBook: async (bookId) => {
    try {
      const cachedBooks = await AsyncStorage.getItem("cached_books");
      if (cachedBooks) {
        const books = JSON.parse(cachedBooks);
        return books.find((book) => book.id === bookId);
      }
      return null;
    } catch (error) {
      console.error("Kitap detayı alma hatası:", error);
      throw error;
    }
  },

  updateBook: async (bookId, bookData) => {
    try {
      const response = await fetch(`${BASE_URL}/kitaplar/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error("Raw API Response:", text);
        throw new Error("Güncelleme yanıtı geçersiz");
      }
    } catch (error) {
      console.error("Update book error:", error);
      throw error;
    }
  },

  deleteBook: async (bookId) => {
    try {
      const cachedBooks = await AsyncStorage.getItem("cached_books");
      if (cachedBooks) {
        const books = JSON.parse(cachedBooks);
        const updatedBooks = books.filter((book) => book.id !== bookId);
        await AsyncStorage.setItem(
          "cached_books",
          JSON.stringify(updatedBooks)
        );
      }
      return { success: true };
    } catch (error) {
      console.error("Kitap silme hatası:", error);
      throw error;
    }
  },

  getBooksByCategory: async (category) => {
    try {
      const response = await fetch(`${BASE_URL}/kitaplar/kategori/${category}`);
      return await response.json();
    } catch (error) {
      console.error("Get books by category error:", error);
      throw error;
    }
  },

  getBooksByFaculty: async (faculty) => {
    try {
      const response = await fetch(`${BASE_URL}/kitaplar/fakulte/${faculty}`);
      return await response.json();
    } catch (error) {
      console.error("Get books by faculty error:", error);
      throw error;
    }
  },
};

// Mesaj işlemleri
export const messageService = {
  createMessage: async (messageData) => {
    try {
      const response = await fetch(`${BASE_URL}/mesajlar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });
      return await response.json();
    } catch (error) {
      console.error("Create message error:", error);
      throw error;
    }
  },

  getAllMessages: async () => {
    try {
      const response = await fetch(`${BASE_URL}/mesajlar`);
      return await response.json();
    } catch (error) {
      console.error("Get all messages error:", error);
      throw error;
    }
  },

  getUserMessages: async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/mesajlar/kullanici/${userId}`);
      return await response.json();
    } catch (error) {
      console.error("Get user messages error:", error);
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await fetch(`${BASE_URL}/mesajlar/${messageId}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      console.error("Delete message error:", error);
      throw error;
    }
  },
};
