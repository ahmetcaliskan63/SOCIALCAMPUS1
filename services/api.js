const BASE_URL = 'http://socialcampus-production.up.railway.app';

export const createUser = async (userData) => {
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
        return data;
    } catch (error) {
        console.error('Create user error:', error);
        throw error;
    }
}; 