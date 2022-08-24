import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#3861fb",
    },
    secondary: {
      main: grey[700],
    },
  },
  typography: {
    fontFamily: '"iransans", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "7px",
          fontWeight: "600",
        },
        sizeMedium: {
          padding: "11px 16px",
          fontSize: "0.85rem",
        },
        sizeLarge: {
          padding: "11px 16px",
          fontSize: "0.85rem",
        },
        sizeSmall: {
          padding: "8px 14px",
          fontSize: "0.7rem",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.9rem",
          fontWeight: "bold",
          color: "#000",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginRight: "0",
          marginLeft: "0",
        },
        label: {
          fontSize: "0.9rem",
          fontWeight: "500",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingRight: "1.5rem",
          paddingLeft: "1.5rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.9rem",
          fontWeight: "bold",
          color: "#000",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "7px",
          backgroundColor: "#fff",
          fontSize: "0.9rem",
        },
        input: {
          padding: "11px 14px",
        },
        inputAdornedStart: {
          paddingLeft: "0",
        },
        notchedOutline: {
          borderColor: "#ddd",
        },
        multiline: {
          padding: "0px",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: "9px",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1)",
        },
        option: {
          padding: "20px 14px",
        },
        inputRoot: {
          padding: "3.5px 7px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.11)",
          background: "#fff",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "65px",
        },
      },
    },
  },
});

export default theme;
