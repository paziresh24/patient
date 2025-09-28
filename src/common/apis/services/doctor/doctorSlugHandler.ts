import { validateDoctorSlug, DoctorSlugResponse, DoctorSlugValidationResponse, DoctorSlugRedirectResponse } from './validateDoctorSlug';

/**
 * Handles doctor slug validation and redirect logic
 * @param slug - The doctor slug to validate
 * @returns Promise with validated slug or redirect information
 */
export const handleDoctorSlug = async (slug: string): Promise<{
  isValid: boolean;
  validatedSlug?: string;
  redirectInfo?: {
    route: string;
    statusCode: number;
  };
  doctorInfo?: DoctorSlugValidationResponse;
}> => {
  try {
    const response: DoctorSlugResponse = await validateDoctorSlug(slug);

    // Check if response contains redirect information
    if ('redirect' in response) {
      return {
        isValid: false,
        redirectInfo: {
          route: response.redirect.route,
          statusCode: response.redirect.statusCode,
        },
      };
    }

    // Valid slug response
    return {
      isValid: true,
      validatedSlug: response.slug,
      doctorInfo: response,
    };
  } catch (error) {
    console.error('Error in handleDoctorSlug:', error);
    
    // Return invalid with fallback redirect
    return {
      isValid: false,
      redirectInfo: {
        route: `/dr/${slug}/`,
        statusCode: 301,
      },
    };
  }
};

/**
 * Checks if a doctor slug is valid without performing redirect
 * @param slug - The doctor slug to check
 * @returns Promise<boolean> - true if slug is valid, false otherwise
 */
export const isDoctorSlugValid = async (slug: string): Promise<boolean> => {
  const result = await handleDoctorSlug(slug);
  return result.isValid;
};

/**
 * Gets the correct slug for a doctor, handling redirects if necessary
 * @param slug - The original slug
 * @returns Promise<string> - The correct slug to use
 */
export const getCorrectDoctorSlug = async (slug: string): Promise<string> => {
  const result = await handleDoctorSlug(slug);
  
  if (result.isValid && result.validatedSlug) {
    return result.validatedSlug;
  }
  
  // If redirect is needed, extract slug from redirect route
  if (result.redirectInfo) {
    const route = result.redirectInfo.route;
    const slugMatch = route.match(/\/dr\/([^\/]+)\//);
    if (slugMatch && slugMatch[1]) {
      return slugMatch[1];
    }
  }
  
  // Fallback to original slug
  return slug;
};
