# Map Search Feature - جستجوی پزشکان اطراف من روی نقشه

A comprehensive map-based doctor search feature similar to Airbnb/Zocdoc/Google Maps with full RTL Persian support.

## 🌟 Features

### Core Functionality
- **Map-based Search**: Interactive map with doctor markers and location sync
- **Real-time Search**: Debounced search with query suggestions API integration
- **Geolocation**: Automatic user location detection with fallback handling
- **URL State Management**: Deep linking support with query parameters (q, lat, lng)
- **RTL Persian Support**: Complete right-to-left layout and Persian UI

### User Experience
- **Location Permission Handling**: Graceful permission requests and error states
- **Map-List Synchronization**: Click on markers to highlight cards and vice versa
- **Responsive Design**: Mobile and desktop optimized layouts
- **Loading States**: Proper loading indicators for all async operations

### API Integration
- **Query Suggestions**: Real-time suggestions using Searchia API
- **Doctor Search**: Jahannama API integration for doctor results
- **Location-based Results**: Filtering by user's geographic location

## 🚀 Quick Start

### Development
```bash
npm run dev
```

Visit: `https://localhost:443/map-search`

### Route
The feature is available at: `/map-search`

## 📊 Architecture

### Components Structure
```
src/
├── pages/
│   └── map-search.tsx                    # Main page route
├── modules/search/components/mapSearch/
│   ├── SearchInput.tsx                   # Search input with suggestions
│   ├── LocationBanner.tsx                # Location permission banner
│   ├── MapComponent.tsx                  # Interactive Leaflet map
│   └── DoctorResultsList.tsx            # Results list with cards
├── modules/search/hooks/
│   └── useMapSearchRouting.ts           # URL state management
├── common/hooks/
│   └── useGeolocation.ts                # Geolocation handling
└── common/apis/services/search/
    ├── queryStringSuggestion.ts         # Query suggestions API
    └── jahannamaSearch.ts               # Doctor search API
```

### API Endpoints

#### 1. Query Suggestions
- **Endpoint**: `GET /v1/searchia-api/v2/qs/index/slim_clinic_query_su`
- **Purpose**: Real-time search suggestions
- **Features**: Spell check, category suggestions, expertise-based suggestions

#### 2. Doctor Search (Jahannama)
- **Endpoint**: `GET /v1/jahannama`
- **Purpose**: Search doctors with location-based filtering
- **Features**: Geolocation support, comprehensive doctor data, ratings

## 🎯 User Scenarios

### 1. User Without Search Query
- Page opens → Request location permission
- **Granted**: Center map on user location, show nearby doctors
- **Denied**: Default to Tehran + show location enable banner

### 2. User With Search Query
- Type in search → Show real-time suggestions
- Select suggestion → Update URL, focus map (if location-based), execute search

### 3. Map/List Interaction
- **Pan/Zoom** map → Update URL bbox, execute debounced search
- **Click marker** → Highlight corresponding card, scroll to it
- **Click/hover card** → Highlight corresponding marker

## 🔧 Technical Implementation

### State Management
- **Search Query**: Debounced input with URL synchronization
- **Map State**: Center coordinates and zoom level in URL
- **Geolocation**: Permission handling and position tracking
- **Selection**: Synchronized doctor selection between map and list

### URL Structure
```
/map-search?q=متخصص قلب&lat=35.6892&lng=51.3890
```

**Parameters:**
- `q`: Search query string
- `lat`: Map center latitude
- `lng`: Map center longitude

### Performance Optimizations
- **Debounced Search**: 500ms delay for search API calls
- **Dynamic Imports**: Map components loaded client-side only
- **Stale Time**: API caching for suggestions (5min) and search (2min)
- **Keep Previous Data**: Seamless loading states during searches

## 🎨 UI/UX Features

### RTL Persian Design
- **Complete RTL Layout**: All components support right-to-left reading
- **Persian Typography**: Proper Persian font rendering and spacing
- **Cultural UX**: Persian-specific interaction patterns

### Responsive Design
- **Desktop**: Side-by-side map and results layout
- **Mobile**: Responsive map with overlay results (future enhancement)

### Accessibility
- **Keyboard Navigation**: Full keyboard support for search and navigation
- **Screen Reader**: ARIA labels and semantic HTML structure
- **Color Contrast**: WCAG compliant color schemes

## 🧪 Testing Scenarios

### Location Permission Testing
- [ ] First visit → Location permission prompt
- [ ] Permission granted → Map centers on user location
- [ ] Permission denied → Show retry banner
- [ ] No geolocation support → Graceful fallback

### Search Functionality
- [ ] Empty search → Show placeholder state
- [ ] Typing → Real-time suggestions appear
- [ ] Select suggestion → Search executes and URL updates
- [ ] No results → Show empty state with suggestions

### Map Interaction
- [ ] Pan map → URL updates with new coordinates
- [ ] Zoom map → URL updates with new zoom level
- [ ] Click marker → Corresponding card highlights
- [ ] Click card → Map centers on doctor location

### URL Deep Linking
- [ ] Direct URL with query → Executes search on load
- [ ] Direct URL with coordinates → Centers map correctly
- [ ] Share URL → Another user sees same search state
- [ ] Browser back/forward → Maintains search state

## 🚀 Future Enhancements

### Phase 2 Features
- **Real Doctor Coordinates**: Integrate actual doctor/clinic locations
- **Advanced Filters**: Price range, availability, insurance acceptance
- **Clustering**: Group nearby doctors into clusters on zoom out
- **Route Planning**: Directions integration with Google Maps

### Phase 3 Features
- **Offline Support**: Cached search results and map tiles
- **Push Notifications**: Appointment reminders and availability alerts
- **Social Features**: Doctor reviews, photos, and social proof
- **AI Recommendations**: Personalized doctor suggestions

## 📱 Mobile Optimizations

### Current Implementation
- Responsive layout with proper touch interactions
- Mobile-optimized search input and results
- Smooth map interactions on touch devices

### Future Mobile Enhancements
- Native app-like transitions
- Pull-to-refresh for results
- Bottom sheet for results on mobile
- Haptic feedback for interactions

## 🔐 Security & Privacy

### Location Privacy
- User consent required for location access
- Location data not stored permanently
- Option to use approximate location for privacy

### API Security
- Rate limiting on search endpoints
- Input validation and sanitization
- HTTPS-only communication

## 📊 Analytics Integration

### Key Metrics
- Search query patterns and success rates
- Location permission grant rates
- Map interaction engagement
- Doctor card click-through rates

### Tracking Events
- Search initiated
- Suggestion selected
- Location permission response
- Doctor profile viewed
- Appointment booking initiated

## 🐛 Known Issues & Limitations

### Current Limitations
1. **Demo Location Data**: Doctor markers use random coordinates around map center
2. **Booking Integration**: Appointment and consultation buttons are placeholders
3. **Real-time Updates**: Doctor availability not real-time

### Browser Compatibility
- **Modern Browsers**: Full feature support
- **IE11**: Limited map functionality
- **Mobile Safari**: Geolocation may require HTTPS

## 🤝 Contributing

### Development Workflow
1. Create feature branch from main
2. Implement changes with tests
3. Ensure RTL compatibility
4. Update documentation
5. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint + Prettier formatting
- Component-based architecture
- Comprehensive error handling

---

## 📞 Support

For questions or issues regarding the map search feature:
- Technical Issues: Check browser console for errors
- API Issues: Verify API keys and endpoint availability
- UI Issues: Test in different browsers and screen sizes