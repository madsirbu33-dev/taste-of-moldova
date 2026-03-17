const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. ТВОИ НАСТРОЙКИ CLOUDINARY ---
cloudinary.config({
    cloud_name: 'dduvubqov',
    api_key: '948913819765557',
    api_secret: '3rESHefJu79yZohYl6XksGC6c6M'
});

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- 3. ХЕЛПЕРЫ ДАННЫХ ---
const getData = (filename) => {
    const filePath = path.join(__dirname, 'data', filename);
    if (!fs.existsSync(filePath)) {
        if (filename === 'analytics.json') return { total_app_opens: 0, ai_interactions: 0, winery_views: {} };
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const saveData = (filename, data) => {
    const dirPath = path.join(__dirname, 'data');
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    const filePath = path.join(dirPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Moldova2026";

const adminAuth = (req, res, next) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) next();
    else res.status(401).json({ error: 'Unauthorized' });
};

// --- 4. PUBLIC API ---
app.get('/api/wineries', (req, res) => res.json(getData('wineries.json')));
app.get('/api/events', (req, res) => res.json(getData('events.json')));
app.get('/api/articles', (req, res) => res.json(getData('articles.json')));

// --- 5. ГЛАВНАЯ МАГИЯ (PUT запрос с Cloudinary) ---
app.put('/api/:type/:id', adminAuth, async (req, res) => {
    const { type, id } = req.params;
    const { password, image, ...updateData } = req.body;

    let finalImageUrl = image;

    try {
        if (image && image.startsWith('data:image')) {
            const uploadRes = await cloudinary.uploader.upload(image, {
                folder: 'taste_of_moldova',
            });
            finalImageUrl = uploadRes.secure_url;
        }

        let fileName = type === 'event' ? 'events.json' : type === 'article' ? 'articles.json' : 'wineries.json';
        let items = getData(fileName);
        const index = items.findIndex(item => item.id == id);

        if (index !== -1) {
            items[index] = { ...items[index], ...updateData, image: finalImageUrl, id: id };
            saveData(fileName, items);
            res.json({ success: true, imageUrl: finalImageUrl });
        } else {
            res.status(404).json({ error: "Elementul nu a fost găsit" });
        }
    } catch (err) {
        res.status(500).json({ error: "Eroare la încărcarea pozei" });
    }
});

// --- 6. ОБСЛУЖИВАНИЕ АДМИН-ПАНЕЛИ (ДОБАВЛЕНО) ---
// Это заставляет сервер искать файлы в папке public
app.use(express.static(path.join(__dirname, 'public')));

// Когда ты заходишь на сайт/admin, сервер отдает admin.html
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// На всякий случай: если зайти просто на корень сайта, тоже покажем админку
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Taste of Moldova Server este LIVE pe portul ${PORT}`);
});