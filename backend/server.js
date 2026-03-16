const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper to read data files
const getData = (filename) => {
    const filePath = path.join(__dirname, 'data', filename);
    if (!fs.existsSync(filePath)) {
        if (filename === 'analytics.json') return { total_app_opens: 0, ai_interactions: 0, winery_views: {} };
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Helper to save data files
const saveData = (filename, data) => {
    const filePath = path.join(__dirname, 'data', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// --- ANALYTICS ENGINE ---
const trackStat = (type, id = null) => {
    try {
        const stats = getData('analytics.json');
        if (type === 'app_open') stats.total_app_opens++;
        if (type === 'ai_interaction') stats.ai_interactions++;
        if (type === 'winery_view' && id) {
            stats.winery_views[id] = (stats.winery_views[id] || 0) + 1;
        }
        saveData('analytics.json', stats);
    } catch (err) {
        console.error('Analytics Error:', err);
    }
};

// Security Key
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Moldova2026";

// Auth Middleware
const adminAuth = (req, res, next) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Serve Static Admin Page
app.use('/admin', express.static(path.join(__dirname, 'public/admin.html')));
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// --- PUBLIC API ---
app.get('/api/wineries', (req, res) => {
    trackStat('app_open');
    res.json(getData('wineries.json'));
});

app.get('/api/events', (req, res) => {
    res.json(getData('events.json'));
});

app.get('/api/articles', (req, res) => {
    res.json(getData('articles.json'));
});

// Analytics Track
app.post('/api/analytics/track', (req, res) => {
    const { type, id } = req.body;
    trackStat(type, id);
    res.json({ success: true });
});

// Admin Stats
app.post('/api/admin/stats', adminAuth, (req, res) => {
    const stats = getData('analytics.json');
    const wineries = getData('wineries.json');
    const topWineries = Object.entries(stats.winery_views)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id, views]) => ({
            name: wineries.find(w => w.id === id)?.name || id,
            views
        }));
    res.json({ ...stats, topWineries });
});

// --- ADMIN API (CRUD) ---

// 1. Создание (POST)
app.post('/api/admin/winery', adminAuth, (req, res) => {
    const wineries = getData('wineries.json');
    const newWinery = {
        id: Date.now().toString(),
        ...req.body,
        rating: 5.0,
        coordinates: { latitude: 47.0, longitude: 28.5 }
    };
    delete newWinery.password; // Удаляем пароль из данных объекта
    wineries.push(newWinery);
    saveData('wineries.json', wineries);
    res.status(201).json(newWinery);
});

app.post('/api/admin/event', adminAuth, (req, res) => {
    const events = getData('events.json');
    const newEvent = {
        id: 'e' + Date.now(),
        ...req.body,
        organizer: 'Taste of Moldova'
    };
    delete newEvent.password;
    events.push(newEvent);
    saveData('events.json', events);
    res.status(201).json(newEvent);
});

// 2. Редактирование (PUT) - ТЕПЕРЬ ИСПРАВЛЕНО
app.put('/api/:type/:id', adminAuth, (req, res) => {
    const { type, id } = req.params;

    // Переводчик имен файлов: winery -> wineries.json
    let fileName = 'wineries.json';
    if (type === 'event') fileName = 'events.json';
    if (type === 'article') fileName = 'articles.json';

    let items = getData(fileName);
    const index = items.findIndex(item => item.id == id);

    if (index !== -1) {
        const { password, ...updateData } = req.body;
        items[index] = { ...items[index], ...updateData, id: id };
        saveData(fileName, items);
        console.log(`✅ Успешно обновлено: ${type} ${id}`);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "Nu a fost găsit" });
    }
});

// 3. Удаление (DELETE)
app.delete('/api/admin/winery/:id', adminAuth, (req, res) => {
    let wineries = getData('wineries.json');
    wineries = wineries.filter(w => w.id !== req.params.id);
    saveData('wineries.json', wineries);
    res.json({ success: true });
});

app.delete('/api/admin/event/:id', adminAuth, (req, res) => {
    let events = getData('events.json');
    events = events.filter(e => e.id !== req.params.id);
    saveData('events.json', events);
    res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});