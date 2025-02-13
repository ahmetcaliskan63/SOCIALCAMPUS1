const API_URL = 'http://192.168.141.242:5000/api';

// Kullanıcı işlemleri
export const userService = {
  createUser: async (userData) => {
    try {
      // Veriyi backend'in beklediği formata dönüştür
      const requestData = {
        tam_ad: userData.tam_ad ? userData.tam_ad.trim() : '',
        fakulte: userData.faculty,
        fakulte_adi: userData.faculty || '',
        bolum: userData.department,
        sartlari_kabul: userData.termsAccepted ? 1 : 0,
        sozlesmeyi_kabul: userData.eulaAccepted ? 1 : 0
      };

      console.log('Gönderilen veri:', requestData);
      
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await response.text();
      console.log('API yanıtı:', responseText);
      
      try {
        const data = JSON.parse(responseText);
        console.log('API yanıtı parse edildi:', data);
        
        if (response.ok) {
          // API yanıtından ID'yi al (nested data içinden de kontrol et)
          const userId = data.id || data.userId || data.user_id || 
                        (data.data && (data.data.id || data.data.userId || data.data.user_id));
          
          if (!userId) {
            console.error('API yanıtında ID bulunamadı:', data);
            return {
              success: false,
              message: 'Kullanıcı ID\'si alınamadı'
            };
          }

          return {
            success: true,
            data: {
              id: userId,
              ...data.data // Eğer data nested ise onu kullan
            }
          };
        } else {
          return {
            success: false,
            message: data.message || 'Kayıt işlemi başarısız oldu'
          };
        }
      } catch (parseError) {
        console.error('JSON parse hatası:', parseError);
        throw new Error('Sunucudan geçersiz yanıt alındı');
      }
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  getUser: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
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
      const currentResponse = await fetch(`${API_URL}/users/${userId}`);
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

      const response = await fetch(`${API_URL}/users/${userId}`, {
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
      const response = await fetch(`${API_URL}/users/fakulte/${faculty}`);
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
      const response = await fetch(`${API_URL}/books`, {
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
      const response = await fetch(`${API_URL}/books`);
      return await response.json();
    } catch (error) {
      console.error('Get all books error:', error);
      throw error;
    }
  },

  getBook: async (bookId) => {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}`);
      return await response.json();
    } catch (error) {
      console.error('Get book error:', error);
      throw error;
    }
  },

  updateBook: async (bookId, bookData) => {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
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
      const response = await fetch(`${API_URL}/books/${bookId}`, {
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
      const response = await fetch(`${API_URL}/books/kategori/${category}`);
      return await response.json();
    } catch (error) {
      console.error('Get books by category error:', error);
      throw error;
    }
  },

  getBooksByFaculty: async (faculty) => {
    try {
      const response = await fetch(`${API_URL}/books/fakulte/${faculty}`);
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
      const response = await fetch(`${API_URL}/messages`, {
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
      const response = await fetch(`${API_URL}/messages`);
      return await response.json();
    } catch (error) {
      console.error('Get all messages error:', error);
      throw error;
    }
  },

  getUserMessages: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/messages/kullanici/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Get user messages error:', error);
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await fetch(`${API_URL}/messages/${messageId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  },
}; 