// This is a skeleton starter React component generated by Plasmic.
// This file is owned by you, feel free to edit as you see fit.
import * as React from "react";
import {
  PlasmicDoctorProfileSeoBox,
  DefaultDoctorProfileSeoBoxProps
} from "./plasmic/paziresh_24/PlasmicDoctorProfileSeoBox";
import { HTMLElementRefOf } from "@plasmicapp/react-web";

// Your component props start with props for variants and slots you defined
// in Plasmic, but you can add more here, like event handlers that you can
// attach to named nodes in your component.
//
// If you don't want to expose certain variants or slots as a prop, you can use
// Omit to hide them:
//
// interface DoctorProfileSeoBoxProps extends Omit<DefaultDoctorProfileSeoBoxProps, "hideProps1"|"hideProp2"> {
//   // etc.
// }
//
// You can also stop extending from DefaultDoctorProfileSeoBoxProps altogether and have
// total control over the props for your component.
export interface DoctorProfileSeoBoxProps
  extends DefaultDoctorProfileSeoBoxProps {}

function DoctorProfileSeoBox_(
  props: DoctorProfileSeoBoxProps,
  ref: HTMLElementRefOf<"div">
) {
  // Use PlasmicDoctorProfileSeoBox to render this component as it was
  // designed in Plasmic, by activating the appropriate variants,
  // attaching the appropriate event handlers, etc.  You
  // can also install whatever React hooks you need here to manage state or
  // fetch data.
  //
  // Props you can pass into PlasmicDoctorProfileSeoBox are:
  // 1. Variants you want to activate,
  // 2. Contents for slots you want to fill,
  // 3. Overrides for any named node in the component to attach behavior and data,
  // 4. Props to set on the root node.
  //
  // By default, we are just piping all DoctorProfileSeoBoxProps here, but feel free
  // to do whatever works for you.

  return <PlasmicDoctorProfileSeoBox root={{ ref }} {...props} />;
}

const DoctorProfileSeoBox = React.forwardRef(DoctorProfileSeoBox_);
export default DoctorProfileSeoBox;
