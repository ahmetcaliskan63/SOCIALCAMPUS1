const handleRegister = async () => {
    try {
        console.log('Kayıt başlıyor, form verileri:', formData);

        // Kullanıcı oluştur
        const user = await userService.createUser(formData);
        console.log('Kullanıcı oluşturuldu:', user);

        // Başarılı kayıt sonrası
        if (user) {  // user.id yerine sadece user kontrolü
            Alert.alert(
                'Başarılı',
                'Kayıt işlemi tamamlandı',
                [
                    {
                        text: 'Tamam',
                        onPress: () => {
                            // Kayıt sonrası işlemler
                            setFormData(initialFormData);
                            setActiveTab('login');
                        }
                    }
                ]
            );
        }
    } catch (error) {
        console.error('Kayıt hatası:', error);
        Alert.alert(
            'Hata',
            'Kayıt işlemi sırasında bir hata oluştu: ' + error.message
        );
    }
}; 