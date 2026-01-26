# Multilingual Mandi API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, no authentication is required for the MVP. All endpoints are publicly accessible.

## Response Format
All API responses follow this structure:
```json
{
  "success": true|false,
  "message": "Human readable message",
  "data": { ... },
  "responseTime": "123ms",
  "timestamp": "2024-01-26T10:30:00.000Z"
}
```

## Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

## Endpoints

### 1. Health Check
**GET** `/health`

Returns server health status and system information.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": "123s",
    "memory": {
      "used": "45MB",
      "total": "128MB"
    },
    "version": "1.0.0"
  }
}
```

### 2. Search Products
**GET** `/search`

Search for products with optional filtering and sorting.

**Parameters:**
- `query` (required): Search term in English or Hindi
- `lang` (optional): Language preference ('en' or 'hi')
- `sortBy` (optional): 'relevance', 'price_low', 'price_high', 'rating'
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `category` (optional): Category filter

**Example:**
```
GET /search?query=tomato&sortBy=price_low&minPrice=20&maxPrice=30
```

### 3. Get Categories
**GET** `/categories`

Returns all available product categories.

### 4. Get Vendor Details
**GET** `/vendor/:id`

Get detailed information about a specific vendor.

**Parameters:**
- `id` (required): Vendor ID

### 5. Get Vendor Reviews
**GET** `/vendor/:id/reviews`

Get paginated reviews for a vendor.

**Parameters:**
- `id` (required): Vendor ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### 6. Translate Text
**POST** `/translate`

Translate text between English and Hindi.

**Body:**
```json
{
  "text": "What is your best price?",
  "from": "en",
  "to": "hi"
}
```

### 7. Get Negotiation Suggestions
**POST** `/negotiate`

Get AI-powered negotiation suggestions.

**Body:**
```json
{
  "currentPrice": 30,
  "productType": "vegetables",
  "negotiationHistory": []
}
```

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Burst limit: 20 requests per minute

## Error Codes
- `VALIDATION_ERROR`: Invalid request parameters
- `NOT_FOUND`: Requested resource not found
- `TRANSLATION_FAILED`: Translation service unavailable
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Development Notes
- All mock data is stored in memory
- Translation uses predefined phrase mappings
- Negotiation AI uses simple percentage-based logic
- No database persistence in MVP version