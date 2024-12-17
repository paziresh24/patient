import * as React from "react";
import {
  PlasmicPaziresh24Button,
  DefaultPaziresh24ButtonProps
} from "./plasmic/paziresh_24_design_system/PlasmicPaziresh24Button";

import {
  ButtonRef,
  HtmlAnchorOnlyProps,
  HtmlButtonOnlyProps
} from "@plasmicapp/react-web";

export interface Paziresh24ButtonProps extends DefaultPaziresh24ButtonProps {
  // Feel free to add any additional props that this component should receive
}
function Paziresh24Button_(props: Paziresh24ButtonProps, ref: ButtonRef) {
  const { plasmicProps } =
    PlasmicPaziresh24Button.useBehavior<Paziresh24ButtonProps>(props, ref);
  return <PlasmicPaziresh24Button {...plasmicProps} />;
}

export type ButtonComponentType = {
  (
    props: Omit<Paziresh24ButtonProps, HtmlAnchorOnlyProps> & {
      ref?: React.Ref<HTMLButtonElement>;
    }
  ): React.ReactElement;
  (
    props: Omit<Paziresh24ButtonProps, HtmlButtonOnlyProps> & {
      ref?: React.Ref<HTMLAnchorElement>;
    }
  ): React.ReactElement;
};
const Paziresh24Button = React.forwardRef(
  Paziresh24Button_
) as any as ButtonComponentType;

export default Object.assign(Paziresh24Button, { __plumeType: "button" });
