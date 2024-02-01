import * as React from "react";
import { PlasmicSelect } from "./plasmic/paziresh_24/PlasmicSelect";
import Select__Option from "./Select__Option";
import Select__OptionGroup from "./Select__OptionGroup";

function Select_(props, ref) {
  const { plasmicProps, state } = PlasmicSelect.useBehavior(props, ref);
  return <PlasmicSelect {...plasmicProps} />;
}

const Select = React.forwardRef(Select_);

export default Object.assign(Select, {
  Option: Select__Option,
  OptionGroup: Select__OptionGroup,
  __plumeType: "select"
});
