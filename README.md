# Multilingual Mandi - 

A web platform for local vendors providing instant AI-driven price discovery and negotiation tools with English-Hindi translation.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser
- Terminal/Command Prompt

### Installation & Setup

1. **Clone and navigate to project:**
   ```bash
   cd multilingual-mandi
   npm install
   ```

2. **Set up backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Start both servers:**
   ```bash
   # Terminal 1 - Backend (Port 5000)
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend (Port 3000)
   npm run dev
   ```

4. **Open browser:** http://localhost:3000

## 🎯 MVP Features

1. **Bilingual Product Search** - Search in English/Hindi with auto-translation
2. **Mock Price Discovery** - Compare prices from multiple vendors
3. **Translation Chat** - Real-time English↔Hindi chat translation
4. **Price Negotiation Simulator** - AI-suggested negotiation flow

## 🎬 Demo Flow

1. **Landing Page** → Select "I'm a Buyer"
2. **Search** → Type "टमाटर" or "tomato"
3. **Price Comparison** → View vendor prices (₹20-35/kg)
4. **Vendor Selection** → Click preferred vendor
5. **Translation Chat** → Send "What's your best price?"
6. **Negotiation** → Use AI suggestions for counter-offers
7. **Deal Summary** → Complete transaction

## 🛠 Tech Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Translation**: Mock API (Google Translate ready)
- **Data**: In-memory mock data
- **Styling**: Custom design system with dark mode

## 📝 Mock Data

- **Products**: Tomato (टमाटर), Onion (प्याज), Potato (आलू)
- **Vendors**: 3-6 local vendors with Hindi names
- **Prices**: ₹20-40/kg range
- **Translations**: Pre-defined common phrases

## 🎯 Hackathon Scope

**Built**: Core MVP with 4 features + responsive UI
**Not Built**: Auth, payments, real vendors, mobile app, voice translation

## 🔧 API Endpoints

### Search Products
```bash
GET /api/search?query=tomato&lang=en
```

### Get Vendor Details
```bash
GET /api/vendor/1
```

### Translate Text
```bash
POST /api/translate
{
  "text": "What is your best price?",
  "from": "en",
  "to": "hi"
}
```

### Get Negotiation Suggestions
```bash
POST /api/negotiate
{
  "currentPrice": 30,
  "productType": "vegetables"
}
```

## 🎨 Design System

- **Primary**: #001f3f (Navy blue)
- **Secondary**: #FF851B (Orange)
- **Accent**: #2ECC40 (Green)
- **Background**: #F5F5F5 (Light gray)
- **Dark Mode**: Full support with toggle

## 📱 Responsive Design

- **Mobile**: 320px-768px (Stack layout)
- **Tablet**: 768px-1024px (2-column grid)
- **Desktop**: 1024px+ (3-column layout)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Landing page loads with bilingual content
- [ ] Dark mode toggle works
- [ ] Search works for "टमाटर" and "tomato"
- [ ] Vendor cards display with pricing
- [ ] Chat shows real-time translation
- [ ] AI negotiation provides suggestions
- [ ] Mobile layout is responsive
- [ ] Complete user journey works

## 🚨 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill existing Node processes
taskkill /f /im node.exe  # Windows
killall node              # Mac/Linux
```

**Frontend not loading:**
- Check if backend is running on port 5000
- Verify no CORS errors in browser console
- Try refreshing the page

**Search not working:**
- Use quick suggestion buttons
- Check backend console for errors
- Verify mock data is loaded

Ready for demo! 🎉

Built with ❤️ for India's local markets
