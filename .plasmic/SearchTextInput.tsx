import * as React from "react";
import {
  PlasmicSearchTextInput,
  DefaultSearchTextInputProps
} from "./plasmic/paziresh_24_search/PlasmicSearchTextInput";

import { TextInputRef } from "@plasmicapp/react-web";

export interface SearchTextInputProps extends DefaultSearchTextInputProps {
  // Feel free to add any additional props that this component should receive
}
function SearchTextInput_(props: SearchTextInputProps, ref: TextInputRef) {
  const { plasmicProps } =
    PlasmicSearchTextInput.useBehavior<SearchTextInputProps>(props, ref);
  return <PlasmicSearchTextInput {...plasmicProps} />;
}

const SearchTextInput = React.forwardRef(SearchTextInput_);

export default Object.assign(
  SearchTextInput,

  {
    __plumeType: "text-input"
  }
);
