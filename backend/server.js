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
// Лимиты для приема тяжелых фото из приложения
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
        // Если пришло новое фото в формате Base64 (с телефона)
        if (image && image.startsWith('data:image')) {
            console.log(`📸 Încarc poza nouă în Cloudinary pentru ${type}...`);
            const uploadRes = await cloudinary.uploader.upload(image, {
                folder: 'taste_of_moldova',
            });
            finalImageUrl = uploadRes.secure_url;
            console.log("✅ Poza a fost salvată în Cloudinary:", finalImageUrl);
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
        console.error("❌ Cloudinary Error:", err);
        res.status(500).json({ error: "Eroare la încărcarea pozei" });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Taste of Moldova Server este LIVE pe portul ${PORT}`);
});