import * as React from "react";
import {
  PlasmicCustomSelect__Overlay,
  DefaultCustomSelect__OverlayProps
} from "./plasmic/ravi_design_system/PlasmicCustomSelect__Overlay";

import { TriggeredOverlayRef } from "@plasmicapp/react-web";

export interface CustomSelect__OverlayProps
  extends DefaultCustomSelect__OverlayProps {
  // Feel free to add any additional props that this component should receive
}
function CustomSelect__Overlay_(
  props: CustomSelect__OverlayProps,
  ref: TriggeredOverlayRef
) {
  const { plasmicProps } = PlasmicCustomSelect__Overlay.useBehavior(props, ref);
  return <PlasmicCustomSelect__Overlay {...plasmicProps} />;
}

const CustomSelect__Overlay = React.forwardRef(CustomSelect__Overlay_);

export default Object.assign(CustomSelect__Overlay, {
  __plumeType: "triggered-overlay"
});
