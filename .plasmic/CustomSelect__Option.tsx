import * as React from "react";
import {
  PlasmicCustomSelect__Option,
  DefaultCustomSelect__OptionProps
} from "./plasmic/ravi_design_system/PlasmicCustomSelect__Option";

import { SelectOptionRef } from "@plasmicapp/react-web";

export interface CustomSelect__OptionProps
  extends DefaultCustomSelect__OptionProps {
  // Feel free to add any additional props that this component should receive
}
function CustomSelect__Option_(
  props: CustomSelect__OptionProps,
  ref: SelectOptionRef
) {
  const { plasmicProps } = PlasmicCustomSelect__Option.useBehavior(props, ref);
  return <PlasmicCustomSelect__Option {...plasmicProps} />;
}

const CustomSelect__Option = React.forwardRef(CustomSelect__Option_);

export default Object.assign(
  CustomSelect__Option,

  {
    __plumeType: "select-option"
  }
);
