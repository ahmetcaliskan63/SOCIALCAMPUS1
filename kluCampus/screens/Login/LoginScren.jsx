const handleRegister = async () => {
    if (!isFormValid || isSubmitted) return;

    try {
        setLoading(true);
        setIsSubmitted(true);

        const requestData = {
            tam_ad: formData.tam_ad,
            faculty: formData.faculty,
            department: formData.department,
            termsAccepted: formData.termsAccepted,
            eulaAccepted: formData.eulaAccepted
        };

        console.log('Gönderilen veri:', requestData); // Debug için

        const response = await userService.createUser(requestData);
        console.log('API yanıtı:', response); // Debug için
        
        // Response kontrolünü geliştirdik
        if (response && (response.success || response.status === 'success')) {
            const userData = {
                id: response.data?.id || response.data?.userId || response.userId,
                tam_ad: formData.tam_ad,
                fakulte: formData.faculty,
                bolum: formData.department
            };
            
            try {
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                await AsyncStorage.setItem('userLoggedIn', 'true');
                
                // Başarılı kayıt mesajı
                Alert.alert(
                    'Başarılı',
                    'Kaydınız başarıyla tamamlandı!',
                    [
                        {
                            text: 'Tamam',
                            onPress: () => {
                                if (onLogin) {
                                    onLogin();
                                }
                            }
                        }
                    ]
                );
            } catch (storageError) {
                console.error('Storage hatası:', storageError);
                Alert.alert('Hata', 'Kullanıcı bilgileri kaydedilirken bir hata oluştu.');
                setIsSubmitted(false);
            }
        } else {
            throw new Error(response?.message || 'Kayıt işlemi başarısız oldu');
        }
    } catch (error) {
        console.error('Kayıt hatası:', error);
        setIsSubmitted(false);
        Alert.alert(
            'Hata',
            error.message || 'Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.'
        );
    } finally {
        setLoading(false);
    }
}; 