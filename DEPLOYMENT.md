# Deployment Guide - Render

## 🚀 Deploy Backend to Render

### 1. Δημιουργία λογαριασμού
1. Πηγαίνετε στο [render.com](https://render.com)
2. Δημιουργήστε λογαριασμό με το GitHub σας
3. Συνδέστε το repository `Syvakas/map-review-booster`

### 2. Δημιουργία Web Service
1. Κάντε κλικ στο **"New +"** → **"Web Service"**
2. Επιλέξτε το repository `map-review-booster`
3. Ρυθμίσεις:
   - **Name**: `map-review-booster-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install --prefix backend`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`

### 3. Environment Variables
Στο Render Dashboard, προσθέστε:
```
NODE_ENV=production
PORT=10000
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Deploy Frontend to Vercel
1. Πηγαίνετε στο [vercel.com](https://vercel.com)
2. Import το GitHub repository
3. Το Vercel θα αναγνωρίσει αυτόματα το Vite project
4. Deploy!

## 🔧 URLs μετά το deployment
- **Backend**: `https://map-review-booster-backend.onrender.com`
- **Frontend**: `https://your-project-name.vercel.app`

## ⚠️ Σημαντικές σημειώσεις
- Το Render free tier "κοιμάται" μετά από 15 λεπτά αδράνειας
- Η πρώτη φόρτωση μετά από "ύπνο" παίρνει ~30 δευτερόλεπτα
- Το frontend αυτόματα χρησιμοποιεί το production backend URL

## 🧪 Testing
Μετά το deployment, τεστάρετε:
1. `https://your-backend.onrender.com/api/health` - θα πρέπει να επιστρέφει `{"status": "OK"}`
2. Το frontend στο Vercel - θα πρέπει να λειτουργεί κανονικά