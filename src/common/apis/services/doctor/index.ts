// Doctor profile API services
export { validateDoctorSlug, type DoctorSlugValidationResponse, type DoctorSlugRedirectResponse, type DoctorSlugErrorResponse, type DoctorSlugResponse } from './validateDoctorSlug';
export { handleDoctorSlug, isDoctorSlugValid, getCorrectDoctorSlug } from './doctorSlugHandler';
export { getDoctorFullName, type DoctorFullNameResponse } from './getDoctorFullName';
export { getDoctorBiography, type DoctorBiographyResponse } from './getDoctorBiography';
export { getDoctorMedicalCode, type DoctorMedicalCodeResponse } from './getDoctorMedicalCode';
export { getDoctorImage, type DoctorImageResponse } from './getDoctorImage';
export { getDoctorCenters, type DoctorCentersResponse } from './getDoctorCenters';
export {
  getDoctorCenterServices,
  useDoctorCenterServices,
  type DoctorCenterServiceResponse,
} from './getDoctorCenterServices';
export { getDoctorGallery, type DoctorGalleryResponse } from './getDoctorGallery';
export { getDoctorExpertise, type DoctorExpertiseResponse } from './getDoctorExpertise';
export {
  getDoctorOnlineChannels,
  useDoctorOnlineChannels,
  normalizeDoctorOnlineChannels,
} from './getDoctorOnlineChannels';
