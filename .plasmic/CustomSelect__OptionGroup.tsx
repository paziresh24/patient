import * as React from "react";
import {
  PlasmicCustomSelect__OptionGroup,
  DefaultCustomSelect__OptionGroupProps
} from "./plasmic/ravi_design_system/PlasmicCustomSelect__OptionGroup";

export interface CustomSelect__OptionGroupProps
  extends DefaultCustomSelect__OptionGroupProps {
  // Feel free to add any additional props that this component should receive
}
function CustomSelect__OptionGroup(props: CustomSelect__OptionGroupProps) {
  const { plasmicProps } = PlasmicCustomSelect__OptionGroup.useBehavior(props);
  return <PlasmicCustomSelect__OptionGroup {...plasmicProps} />;
}

export default Object.assign(
  CustomSelect__OptionGroup,

  {
    __plumeType: "select-option-group"
  }
);
