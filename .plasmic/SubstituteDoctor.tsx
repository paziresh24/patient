// This is a skeleton starter React component generated by Plasmic.
// This file is owned by you, feel free to edit as you see fit.
import * as React from 'react';
import { PlasmicSubstituteDoctor, DefaultSubstituteDoctorProps } from './plasmic/paziresh_24_search/PlasmicSubstituteDoctor';

// Your component props start with props for variants and slots you defined
// in Plasmic, but you can add more here, like event handlers that you can
// attach to named nodes in your component.
//
// If you don't want to expose certain variants or slots as a prop, you can use
// Omit to hide them:
//
// interface SubstituteDoctorProps extends Omit<DefaultSubstituteDoctorProps, "hideProps1"|"hideProp2"> {
//   // etc.
// }
//
// You can also stop extending from DefaultSubstituteDoctorProps altogether and have
// total control over the props for your component.
export interface SubstituteDoctorProps extends DefaultSubstituteDoctorProps {
  expertise?: string;
  turnType?: string;
  className?: string;
}

function SubstituteDoctor({ expertise, turnType, className, ...plasmicProps }: SubstituteDoctorProps) {
  return <PlasmicSubstituteDoctor {...plasmicProps} />;
}

export default SubstituteDoctor;
