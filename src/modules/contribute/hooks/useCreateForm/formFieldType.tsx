import { Autocomplete, AutocompleteProps, TextField, TextFieldProps } from '@mui/material';

export const formFiledType = {
  textField: (props?: TextFieldProps) => <TextField {...props} fullWidth />,
  autoComplete: <
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined,
  >(
    props: Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'>,
  ) => (
    <Autocomplete
      {...props}
      disablePortal
      fullWidth
      isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
      renderInput={(params: any) => <TextField {...params} fullWidth />}
    />
  ),
};
