const BASE_URL = 'https://socialcampus-production.up.railway.app';

// Kullanıcı işlemleri
export const userService = {
  createUser: async (userData) => {
    try {
      console.log('İstek gönderiliyor:', userData);
      const response = await fetch(`${BASE_URL}/kullanicilar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      console.log('Sunucu yanıtı:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Sunucu hatası:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error('Kullanıcı oluşturma başarısız');
      }

      return data.data;  // Kullanıcı bilgilerini döndür
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  getUser: async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/kullanicilar/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      console.log('userService updateUser çağrıldı:', { userId, userData });
      
      // Mevcut değerleri al
      const currentResponse = await fetch(`${BASE_URL}/kullanicilar/${userId}`);
      const currentData = await currentResponse.json();
      
      if (!currentData.success) {
        throw new Error('Mevcut kullanıcı bilgileri alınamadı');
      }

      // Güncellenecek verileri hazırla
      const updateData = {
        tam_ad: userData.tam_ad || currentData.data.tam_ad,
        fakulte: userData.fakulte || currentData.data.fakulte,
        bolum: userData.bolum || currentData.data.bolum
      };

      console.log('Güncellenecek veriler:', updateData);

      const response = await fetch(`${BASE_URL}/kullanicilar/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      console.log('userService updateUser yanıtı:', result);
      return result;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  getUsersByFaculty: async (faculty) => {
    try {
      const response = await fetch(`${BASE_URL}/kullanicilar/fakulte/${faculty}`);
      return await response.json();
    } catch (error) {
      console.error('Get users by faculty error:', error);
      throw error;
    }
  },
};

// Kitap işlemleri
export const bookService = {
  createBook: async (bookData) => {
    try {
      const response = await fetch(`${BASE_URL}/kitaplar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create book error:', error);
      throw error;
    }
  },

  getAllBooks: async () => {
    try {
      const response = await fetch(`${BASE_URL}/kitaplar`);
      return await response.json();
    } catch (error) {
      console.error('Get all books error:', error);
      throw error;
    }
  },

  getBook: async (bookId) => {
    try {
      const response = await fetch(`${BASE_URL}/kitaplar/${bookId}`);
      return await response.json();
    } catch (error) {
      console.error('Get book error:', error);
      throw error;
    }
  },

  updateBook: async (bookId, bookData) => {
    try {
      const response = await fetch(`${BASE_URL}/kitaplar/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      return await response.json();
    } catch (error) {
      console.error('Update book error:', error);
      throw error;
    }
  },

  deleteBook: async (bookId) => {
    try {
      const response = await fetch(`${BASE_URL}/kitaplar/${bookId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Delete book error:', error);
      throw error;
    }
  },

  getBooksByCategory: async (category) => {
    try {
      const response = await fetch(`${BASE_URL}/kitaplar/kategori/${category}`);
      return await response.json();
    } catch (error) {
      console.error('Get books by category error:', error);
      throw error;
    }
  },

  getBooksByFaculty: async (faculty) => {
    try {
      const response = await fetch(`${BASE_URL}/kitaplar/fakulte/${faculty}`);
      return await response.json();
    } catch (error) {
      console.error('Get books by faculty error:', error);
      throw error;
    }
  },
};

// Mesaj işlemleri
export const messageService = {
  createMessage: async (messageData) => {
    try {
      const response = await fetch(`${BASE_URL}/mesajlar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create message error:', error);
      throw error;
    }
  },

  getAllMessages: async () => {
    try {
      const response = await fetch(`${BASE_URL}/mesajlar`);
      return await response.json();
    } catch (error) {
      console.error('Get all messages error:', error);
      throw error;
    }
  },

  getUserMessages: async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/mesajlar/kullanici/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Get user messages error:', error);
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await fetch(`${BASE_URL}/mesajlar/${messageId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  },
}; 