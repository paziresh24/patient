# Doctor Profile API Services

This directory contains API services for doctor profile management, including slug validation and profile data fetching.

## Slug Validation Service

### `validateDoctorSlug(slug: string)`

Validates a doctor slug using the web service endpoint: `https://drprofile.paziresh24.com/api/doctors/{slug}`

**Response Types:**
- **Valid Slug**: Returns doctor information including `id`, `slug`, `owner_id`, `server_id`, `type`, and `user_id`
- **Invalid Slug (200)**: Returns redirect information with `route` and `statusCode`
- **Invalid Slug (400)**: Returns redirect information with `route` and `statusCode` from error response
- **Slug Not Found**: Returns error information with `error` field (e.g., "Slug not found") - triggers 404 page

**Example Usage:**
```typescript
import { validateDoctorSlug } from '@/common/apis/services/doctor/validateDoctorSlug';

const result = await validateDoctorSlug('دکتر-پروفسور-نور-بالا');

if ('error' in result) {
  // Handle slug not found - show 404 page
  console.log('Slug not found:', result.error);
} else if ('redirect' in result) {
  // Handle redirect
  console.log('Redirect to:', result.redirect.route);
} else {
  // Use validated slug
  console.log('Valid slug:', result.slug);
}
```

### Helper Functions

#### `handleDoctorSlug(slug: string)`
Comprehensive slug handler that returns validation status and appropriate data.

#### `isDoctorSlugValid(slug: string)`
Simple boolean check for slug validity.

#### `getCorrectDoctorSlug(slug: string)`
Returns the correct slug to use, handling redirects automatically.

## Splunk Logging

All services include comprehensive Splunk logging with appropriate groups and types:

- **Success Events**: `doctor_slug_validation_success`, `doctor_slug_redirect`
- **400 Error Events**: `doctor_slug_redirect_400` (when 400 error contains redirect)
- **Slug Not Found Events**: `doctor_slug_not_found` (when slug doesn't exist)
- **404 Page Events**: `doctor_profile_404` (when 404 page is shown to user)
  - `page_not_found`: Main 404 event from getAggregatedProfileData
  - `page_not_found_fallback`: Fallback 404 from validateDoctorSlug
  - `page_not_found_handler`: 404 from doctorSlugHandler
  - `page_not_found_catch`: 404 from catch block in doctorSlugHandler
- **Other Error Events**: `doctor_slug_validation_error`

## Integration

The slug validation service is automatically integrated into the profile system and is always active (no feature flag required). It:

1. **Always validates** the incoming slug as the primary reference
2. **Handles redirects** for invalid slugs automatically
3. **Uses the validated slug** for all subsequent API calls
4. **Falls back to full profile** if slug validation fails
5. **Maintains backward compatibility** with existing functionality

### Flow:
1. **Parallel**: Slug validation and full profile services are called simultaneously
2. **Slug Redirect**: If slug validation returns redirect, user is redirected immediately
3. **Slug Success**: Uses validated slug for all operations
4. **Full Profile**: Provides data only (no redirect handling)
5. **Error Handling**: Slug validation errors are logged but don't block the process
6. **Logging**: All events are logged to Splunk for monitoring
