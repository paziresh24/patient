import * as React from "react";
import {
  PlasmicCustomSelect,
  DefaultCustomSelectProps
} from "./plasmic/ravi_design_system/PlasmicCustomSelect";

import { SelectRef } from "@plasmicapp/react-web";
import CustomSelect__Option from "./CustomSelect__Option";
import CustomSelect__OptionGroup from "./CustomSelect__OptionGroup";

export interface CustomSelectProps extends DefaultCustomSelectProps {
  // Feel free to add any additional props that this component should receive
}
function CustomSelect_(props: CustomSelectProps, ref: SelectRef) {
  const { plasmicProps, state } = PlasmicCustomSelect.useBehavior(props, ref);
  return <PlasmicCustomSelect {...plasmicProps} />;
}

const CustomSelect = React.forwardRef(CustomSelect_);

export default Object.assign(
  CustomSelect,

  {
    Option: CustomSelect__Option,
    OptionGroup: CustomSelect__OptionGroup,
    __plumeType: "select"
  }
);
