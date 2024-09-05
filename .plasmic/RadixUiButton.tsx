import * as React from "react";
import {
  PlasmicRadixUiButton,
  DefaultRadixUiButtonProps
} from "./plasmic/radix_ui/PlasmicRadixUiButton";

import {
  ButtonRef,
  HtmlAnchorOnlyProps,
  HtmlButtonOnlyProps
} from "@plasmicapp/react-web";

export interface RadixUiButtonProps extends DefaultRadixUiButtonProps {
  // Feel free to add any additional props that this component should receive
}
function RadixUiButton_(props: RadixUiButtonProps, ref: ButtonRef) {
  const { plasmicProps } = PlasmicRadixUiButton.useBehavior<RadixUiButtonProps>(
    props,
    ref
  );
  return <PlasmicRadixUiButton {...plasmicProps} />;
}

export type ButtonComponentType = {
  (
    props: Omit<RadixUiButtonProps, HtmlAnchorOnlyProps> & {
      ref?: React.Ref<HTMLButtonElement>;
    }
  ): React.ReactElement;
  (
    props: Omit<RadixUiButtonProps, HtmlButtonOnlyProps> & {
      ref?: React.Ref<HTMLAnchorElement>;
    }
  ): React.ReactElement;
};
const RadixUiButton = React.forwardRef(
  RadixUiButton_
) as any as ButtonComponentType;

export default Object.assign(RadixUiButton, { __plumeType: "button" });
