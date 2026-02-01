# Multilingual Mandi - AI-Powered Marketplace

A web platform for local vendors providing instant AI-driven price discovery, negotiation tools, speech-to-text capabilities, and multilingual AI assistance with English-Hindi translation.

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

## 🎯 Core Features

### 🛍️ Customer Features
1. **Bilingual Product Search** - Search in English/Hindi with auto-translation
2. **AI Shopping Assistant** 🤖 - Multilingual AI chatbot with:
   - Speech-to-text voice input
   - Context-aware product recommendations
   - Price negotiation guidance
   - Quality & delivery information
3. **Price Discovery** - Compare prices from multiple vendors
4. **Translation Chat** - Real-time English↔Hindi chat translation with vendor
5. **AI Negotiation Bot** - Smart price suggestions with:
   - Market analysis-based recommendations
   - Deal probability calculator
   - Profit margin tracker
6. **Voice Messaging** - Record and send voice messages
7. **Image Sharing** - Share product images in chat
8. **Order Management** - Track orders with 5 statuses (pending → confirmed → out-for-delivery → delivered)

### 🏪 Vendor Features
1. **Vendor Workspace** - Complete management dashboard with 15+ features
2. **Order Processing** - Accept, manage, and fulfill customer orders
3. **Buyer Requests** - Handle and negotiate bulk purchase requests
4. **Customer Chat** - WhatsApp-style communication with customers
5. **AI Negotiation Assistant** - Automated price negotiation with profit tracking
6. **Analytics Dashboard** - Sales insights and performance metrics
7. **Product Management** - Add, edit, delete inventory

### 🤖 AI & Speech Features
1. **Multilingual AI Agent** 🎯
   - Understands English & Hindi
   - Context-aware responses
   - Smart suggestions based on conversation
   - Price negotiation expertise
   - Quality & delivery information
   
2. **Speech-to-Text** 🎤
   - Voice input in English/Hindi
   - Real-time transcription
   - Confidence scoring
   - Auto-language detection

3. **AI Negotiation Engine** 💰
   - Price suggestion algorithm (50-60% optimal range)
   - Deal probability analysis (40-95%)
   - Profit margin calculation
   - Market-based recommendations

## � Recent UI/UX Improvements

### Dynamic Floating Action Button (Jan 2026)
- **Smart Positioning**: Floating home/search button dynamically moves when AI Assistant opens
- **Animation**: Smooth 500ms transition between positions
  - Normal state: `bottom-6` (24px from bottom)
  - AI open state: `bottom-[30rem]` (480px from bottom - drops down)
  - AI button: `bottom-24` (96px from bottom)
- **Global State Management**: Implemented `AIAssistantContext` using React Context API
  - Replaces local state management across all pages
  - Single source of truth for AI Assistant visibility
  - Used in: Homepage, Search, Vendor Workspace, Vendor Chat
- **Enhanced Error Handling**: Bilingual error messages (English/Hindi) with user-friendly backend connection instructions
- **Fixed Overlapping Issues**: Resolved AI Assistant button overlapping with floating action buttons

### Technical Implementation
- Created `src/contexts/AIAssistantContext.tsx` for global AI state
- Updated `FloatingActionButton.tsx` with dynamic positioning based on `isAIOpen` state
- Migrated all pages to use `useAIAssistant()` hook
- Added smooth CSS transitions with `transition-all duration-500`
- Enhanced search error handling with backend status detection

## 🎬 Demo Flow

1. **Landing Page** → Select "I'm a Buyer"
2. **Search** → Type "टमाटर" or "tomato"
3. **AI Assistant** → Click 🤖 button for AI help (floating button automatically drops down)
4. **Price Comparison** → View vendor prices (₹20-35/kg)
5. **Vendor Chat** → Negotiate with AI assistance
6. **Voice Input** → Use 🎤 button for voice messages
7. **Place Order** → Complete purchase
8. **Translation Chat** → Send "What's your best price?"
9. **Negotiation** → Use AI suggestions for counter-offers
10. **Deal Summary** → Complete transaction

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

**Search not working / "Failed to fetch" error:**
- Ensure backend server is running on port 5000
- Check terminal for backend errors
- Recent fix: Removed duplicate `chatHistory` declaration in `server.js`
- Use correct path: `cd multilingual-mandi/backend; npm run dev`
- Verify mock data is loaded
- Check browser console for specific error messages

**Backend server won't start:**
- Check for syntax errors in `server.js`
- Ensure you're in the correct directory (`multilingual-mandi/backend`)
- Run `npm install` in backend directory if dependencies are missing
- Check if port 5000 is already in use

Ready for demo! 🎉

Built with ❤️ for India's local markets
