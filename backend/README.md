# Smart Review Enhancer - Backend API

Αυτό είναι το backend API για την εφαρμογή Smart Review Enhancer που χρησιμοποιεί το OpenAI API για τη βελτίωση κριτικών.

## Χαρακτηριστικά

- ✅ Express.js server με CORS support
- ✅ OpenAI GPT-4o integration
- ✅ Input validation και error handling
- ✅ Rate limiting για προστασία
- ✅ Security headers με Helmet
- ✅ Graceful shutdown handling

## Εγκατάσταση

1. Μετάβαση στον φάκελο backend:
```bash
cd backend
```

2. Εγκατάσταση dependencies:
```bash
npm install
```

3. Δημιουργία .env αρχείου:
```bash
cp .env.example .env
```

4. Προσθήκη του OpenAI API key στο .env:
```env
OPENAI_API_KEY=your_actual_api_key_here
MODEL=gpt-4o
PORT=8080
```

## Εκτέλεση

### Development mode (με auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
```http
GET /health
```

Επιστρέφει την κατάσταση του server.

### Review Rewrite
```http
POST /api/rewrite
Content-Type: application/json

{
  "text": "Η αρχική κριτική (10-2000 χαρακτήρες)",
  "keywords": "προαιρετικές λέξεις-κλειδιά" // optional
}
```

**Response:**
```json
{
  "success": true,
  "improvedText": "Η βελτιωμένη κριτική...",
  "originalLength": 45,
  "improvedLength": 120,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Validation Rules

- **text**: Υποχρεωτικό, 10-2000 χαρακτήρες
- **keywords**: Προαιρετικό, μέχρι 200 χαρακτήρες

## Error Handling

Το API επιστρέφει κατάλληλα error messages για:
- Validation errors (400)
- Authentication errors (401) 
- Rate limiting (429)
- Server errors (500)

## Security Features

- **Rate Limiting**: 100 requests ανά 15 λεπτά ανά IP
- **CORS**: Configured για frontend ports (8081, 5173)
- **Helmet**: Security headers
- **Input Validation**: Sanitization και validation
- **Error Handling**: Secure error responses

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| OPENAI_API_KEY | ✅ | - | OpenAI API key |
| MODEL | ❌ | gpt-4o | OpenAI model |
| PORT | ❌ | 8080 | Server port |
| NODE_ENV | ❌ | development | Environment |

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Βεβαιωθείτε ότι το OPENAI_API_KEY είναι στο .env αρχείο

2. **CORS errors**
   - Ελέγξτε ότι το frontend τρέχει στο σωστό port (8081 ή 5173)

3. **Rate limiting**
   - Περιμένετε 15 λεπτά ή επανεκκινήστε τον server

### Logs

Ο server εμφανίζει χρήσιμα logs για:
- Server startup information
- API requests και responses
- Errors και exceptions

## Development

### File Structure
```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env.example       # Environment template
├── .env              # Your environment (not in git)
└── README.md         # This file
```

### Adding New Features

1. Προσθέστε νέα routes στο server.js
2. Προσθέστε validation rules
3. Ενημερώστε το README
4. Τεστάρετε με το frontend

## Production Deployment

1. Ορίστε NODE_ENV=production
2. Χρησιμοποιήστε process manager (PM2)
3. Ρυθμίστε reverse proxy (nginx)
4. Ενεργοποιήστε HTTPS
5. Παρακολουθήστε logs και metrics