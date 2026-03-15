const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const fs = require('fs');
const path = require('path');

// Security Key
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Moldova2026";

// Serve Static Admin Page
app.use('/admin', express.static(path.join(__dirname, 'public/admin.html')));
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Helper to read data files
const getData = (filename) => {
    const filePath = path.join(__dirname, 'data', filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Helper to save data files
const saveData = (filename, data) => {
    const filePath = path.join(__dirname, 'data', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Auth Middleware (Simplistic for MVP)
const adminAuth = (req, res, next) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// --- PUBLIC API ---
app.get('/api/wineries', (req, res) => {
    try {
        const wineries = getData('wineries.json');
        res.json(wineries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wineries' });
    }
});

app.get('/api/events', (req, res) => {
    try {
        const events = getData('events.json');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// --- ADMIN API (CRUD) ---
app.post('/api/admin/winery', adminAuth, (req, res) => {
    const wineries = getData('wineries.json');
    const newWinery = {
        id: Date.now().toString(),
        name: req.body.name,
        region: req.body.region,
        igpId: req.body.region.toLowerCase().replace(/ /g, '-'),
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        topWines: req.body.topWines,
        rating: 5.0,
        coordinates: { latitude: 47.0, longitude: 28.5 } // Default for now
    };
    wineries.push(newWinery);
    saveData('wineries.json', wineries);
    res.status(201).json(newWinery);
});

app.post('/api/admin/event', adminAuth, (req, res) => {
    const events = getData('events.json');
    const newEvent = {
        id: 'e' + Date.now(),
        title: req.body.title,
        date: req.body.date,
        displayDate: req.body.displayDate,
        location: req.body.location,
        price: 'TBD',
        organizer: 'Taste of Moldova',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        description: 'Eveniment adăugat prin Admin Dashboard',
        ticketUrl: req.body.ticketUrl
    };
    events.push(newEvent);
    saveData('events.json', events);
    res.status(201).json(newEvent);
});

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

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Taste of Moldova API is running',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔑 Admin Dashboard: /admin`);
});
