# Requirements Document

## Introduction

The Multilingual Mandi is a 48-hour hackathon MVP for a multilingual local trade platform. It's a web application that connects local vendors with buyers in India, providing real-time English-Hindi translation for price discovery and negotiation with AI-powered negotiation assistance. The platform aims to empower India's local markets with AI, making trade more inclusive, transparent, and efficient.

## Glossary

- **System**: The Multilingual Mandi web platform
- **User**: A buyer or vendor using the platform
- **Buyer**: A user looking to purchase products
- **Vendor**: A seller offering products (mock data for MVP)
- **Translation_Engine**: The component handling English↔Hindi translation
- **Price_Discovery_Engine**: The component displaying mock vendor prices
- **Negotiation_Assistant**: The AI component suggesting counter-offers
- **Chat_Interface**: The messaging system between buyers and vendors

## Requirements

### Requirement 1: Bilingual Product Search

**User Story:** As a buyer, I want to search for products in either English or Hindi, so that I can find items using my preferred language.

#### Acceptance Criteria

1. WHEN a user enters a search term in English, THE System SHALL display relevant products with Hindi translations
2. WHEN a user enters a search term in Hindi, THE System SHALL display relevant products with English translations
3. WHEN displaying search results, THE System SHALL show product names in both languages
4. THE System SHALL provide search suggestions in both English and Hindi
5. WHEN no products match the search term, THE System SHALL display helpful suggestions in the user's input language

### Requirement 2: Mock Price Discovery

**User Story:** As a buyer, I want to see prices from multiple vendors for comparison, so that I can make informed purchasing decisions.

#### Acceptance Criteria

1. WHEN a user searches for a product, THE System SHALL display 3-4 mock vendor prices for comparison
2. WHEN displaying vendor prices, THE System SHALL show price ranges between ₹20-35 per kg for produce items
3. THE System SHALL display vendor information including name and basic details
4. WHEN showing prices, THE System SHALL format currency in Indian Rupees (₹)
5. THE System SHALL sort vendors by price or rating when requested

### Requirement 3: Basic Translation Chat

**User Story:** As a buyer, I want to communicate with vendors in my preferred language, so that language barriers don't prevent successful transactions.

#### Acceptance Criteria

1. WHEN a buyer sends a message in English, THE Translation_Engine SHALL convert it to Hindi for the vendor
2. WHEN a vendor responds in Hindi, THE Translation_Engine SHALL convert it to English for the buyer
3. THE Chat_Interface SHALL display both original and translated text for clarity
4. WHEN translation fails, THE System SHALL display the original message with an error indicator
5. THE System SHALL maintain message history during the chat session

### Requirement 4: Price Negotiation Simulator

**User Story:** As a buyer, I want AI assistance during price negotiations, so that I can negotiate effectively even without experience.

#### Acceptance Criteria

1. WHEN a vendor provides a price quote, THE Negotiation_Assistant SHALL suggest appropriate counter-offers
2. WHEN generating counter-offers, THE System SHALL consider market price ranges and negotiation best practices
3. THE System SHALL provide negotiation suggestions in the buyer's preferred language
4. WHEN a deal is reached, THE System SHALL display a transaction summary with final agreed price
5. THE Negotiation_Assistant SHALL suggest polite negotiation phrases in both languages

### Requirement 5: Responsive Web Interface

**User Story:** As a user, I want to access the platform on any device, so that I can trade from mobile phones, tablets, or computers.

#### Acceptance Criteria

1. THE System SHALL display properly on mobile devices with screen widths from 320px to 768px
2. THE System SHALL display properly on tablet devices with screen widths from 768px to 1024px
3. THE System SHALL display properly on desktop devices with screen widths above 1024px
4. WHEN the screen size changes, THE System SHALL adapt the layout without losing functionality
5. THE System SHALL maintain touch-friendly interface elements on mobile devices

### Requirement 6: Dark Mode Support

**User Story:** As a user, I want to toggle between light and dark themes, so that I can use the platform comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE System SHALL provide a toggle to switch between light and dark themes
2. WHEN dark mode is enabled, THE System SHALL use appropriate dark color schemes for all components
3. WHEN theme preference is set, THE System SHALL persist the choice in browser storage
4. THE System SHALL maintain proper contrast ratios in both light and dark modes
5. WHEN the page loads, THE System SHALL apply the user's previously selected theme

### Requirement 7: Demo Flow Navigation

**User Story:** As a demo user, I want to follow a guided flow from landing to transaction completion, so that I can understand the platform's capabilities.

#### Acceptance Criteria

1. WHEN a user visits the landing page, THE System SHALL provide clear "I'm a Buyer" selection
2. WHEN "I'm a Buyer" is selected, THE System SHALL navigate to the product search interface
3. WHEN a search is performed, THE System SHALL display vendor comparison results
4. WHEN a vendor is selected, THE System SHALL open the chat interface
5. WHEN negotiation is completed, THE System SHALL show a transaction summary page

### Requirement 8: Mock Data Management

**User Story:** As a system administrator, I want the platform to use realistic mock data, so that demos are convincing and representative.

#### Acceptance Criteria

1. THE System SHALL store mock vendor data in memory without requiring database persistence
2. THE System SHALL provide realistic product names, prices, and vendor information
3. WHEN generating mock prices, THE System SHALL use appropriate Indian market price ranges
4. THE System SHALL include common Indian produce items like tomatoes, onions, and rice
5. THE System SHALL generate consistent mock data across user sessions

### Requirement 9: Translation API Integration

**User Story:** As a developer, I want the system to support translation API integration, so that real translation services can be added later.

#### Acceptance Criteria

1. THE Translation_Engine SHALL provide a mock translation API that simulates Google Translate responses
2. WHEN integrating real translation services, THE System SHALL support the same interface
3. THE System SHALL handle translation API errors gracefully
4. WHEN translation is unavailable, THE System SHALL display original text with appropriate messaging
5. THE Translation_Engine SHALL support bidirectional English↔Hindi translation

### Requirement 10: Performance Optimization

**User Story:** As a user, I want the platform to load quickly and respond promptly, so that I can complete transactions efficiently.

#### Acceptance Criteria

1. THE System SHALL load the initial page within 3 seconds on standard broadband connections
2. WHEN navigating between pages, THE System SHALL complete transitions within 1 second
3. THE System SHALL optimize images and assets for web delivery
4. WHEN performing searches, THE System SHALL return results within 500 milliseconds
5. THE System SHALL minimize JavaScript bundle size for faster loading


## Additional Requirements (Hackathon-Critical)

### Requirement 11: Deterministic Mock Data Seeding
**User Story:** As a demo presenter, I want mock data to be consistent across sessions so the demo is predictable and reliable.

#### Acceptance Criteria
1. THE System SHALL seed mock vendor and product data at backend startup from a static JSON file.
2. THE seeded mock data SHALL remain consistent across page reloads during a demo session.
3. THE System SHALL expose a simple internal endpoint `/admin/reset-mocks` (non-public, demo-only) to re-seed mock data if needed.

---

### Requirement 12: Error Handling & Fallback UX
**User Story:** As a user, I want clear feedback if AI or translation features fail so I can still complete the flow.

#### Acceptance Criteria
1. WHEN translation fails, THE System SHALL display the original message with a visible error indicator and a retry option.
2. WHEN the Negotiation_Assistant is unavailable, THE System SHALL provide a fallback price suggestion based on average market prices.
3. THE System SHALL gracefully handle API failures without breaking the demo flow.

---

### Requirement 13: Environment & API Key Safety
**User Story:** As a developer, I want secrets handled safely so the project can be shared and deployed easily.

#### Acceptance Criteria
1. THE System SHALL store all API keys and secrets in environment variables.
2. THE repository SHALL include a `.env.example` file listing required environment variables.
3. WHEN environment variables are missing, THE System SHALL default to mock translation and AI services.

---

### Requirement 14: Minimal Testing & Validation
**User Story:** As a developer, I want basic validation so I can confidently demo the system.

#### Acceptance Criteria
1. THE System SHALL include at least three backend tests covering search, price discovery, and translation mock APIs.
2. THE System SHALL validate API responses for required fields before rendering in the UI.
3. THE System SHALL include a short manual testing checklist in the README.

---

### Requirement 15: Accessibility & Usability Baseline
**User Story:** As a user, I want the interface to be easy to read and interact with on all devices.

#### Acceptance Criteria
1. THE System SHALL ensure all buttons and inputs meet minimum touch-target size requirements.
2. THE System SHALL maintain sufficient color contrast in both light and dark themes.
3. THE System SHALL provide clear visual hierarchy using typography and spacing.

---

### Requirement 16: Demo & Deployment Readiness
**User Story:** As a hackathon team member, I want a reliable demo flow so judges can understand the product quickly.

#### Acceptance Criteria
1. THE repository SHALL include a short demo script outlining the recommended demo flow.
2. THE System SHALL support a single command or script to start both frontend and backend locally.
3. THE System SHALL display realistic sample data immediately on first load for demo purposes.
