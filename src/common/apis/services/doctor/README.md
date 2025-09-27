# Doctor Profile API Services

This directory contains API services for doctor profile management, including slug validation and profile data fetching.

## New Slug Validation Service

### `validateDoctorSlug(slug: string)`

Validates a doctor slug using the new web service endpoint: `https://drprofile.paziresh24.com/api/doctors/{slug}`

**Response Types:**
- **Valid Slug**: Returns doctor information including `id`, `slug`, `owner_id`, `server_id`, `type`, and `user_id`
- **Invalid Slug**: Returns redirect information with `route` and `statusCode`

**Example Usage:**
```typescript
import { validateDoctorSlug } from '@/common/apis/services/doctor/validateDoctorSlug';

const result = await validateDoctorSlug('دکتر-پروفسور-نور-بالا');

if ('redirect' in result) {
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
- **Error Events**: `doctor_slug_validation_error`

## Integration

The slug validation service is automatically integrated into the profile system when the `useClApi` feature flag is enabled. It:

1. Validates the incoming slug
2. Handles redirects for invalid slugs
3. Uses the validated slug for all subsequent API calls
4. Maintains backward compatibility with existing functionality
