const Message = require('../models/messageModel');
const { v4: uuidv4 } = require('uuid');

// Mesaj oluştur
const createMessage = async (req, res) => {
    try {
        const messageData = {
            id: uuidv4(),
            kullanici_id: req.user.id,
            kullanici_adi: req.user.tam_ad,
            ...req.body
        };

        const result = await Message.create(messageData);
        
        if (result) {
            res.status(201).json({
                success: true,
                data: messageData
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Mesaj oluşturulamadı',
            error: error.message
        });
    }
};

// Mesaj getir
const getMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        
        if (message) {
            res.status(200).json({
                success: true,
                data: message
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Mesaj bulunamadı'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Mesaj alınamadı',
            error: error.message
        });
    }
};

// Kullanıcının mesajlarını getir
const getUserMessages = async (req, res) => {
    try {
        const messages = await Message.findByUserId(req.params.kullanici_id);
        
        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Mesajlar alınamadı',
            error: error.message
        });
    }
};

// Mesaj sil
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Mesaj bulunamadı'
            });
        }

        // Mesajı sadece sahibi silebilir
        if (message.kullanici_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için yetkiniz yok'
            });
        }

        const result = await Message.delete(req.params.id);
        
        if (result.affectedRows > 0) {
            res.status(200).json({
                success: true,
                message: 'Mesaj başarıyla silindi'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Mesaj silinemedi',
            error: error.message
        });
    }
};

// Tüm mesajları getir
const getAllMessages = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const messages = await Message.getAllMessages(limit);
        
        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Mesajlar alınamadı',
            error: error.message
        });
    }
};

module.exports = {
    createMessage,
    getMessage,
    getUserMessages,
    deleteMessage,
    getAllMessages
}; 