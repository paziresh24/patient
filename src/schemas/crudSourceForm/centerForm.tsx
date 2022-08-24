import { InputAdornment, TextFieldProps } from "@mui/material";
import { SectionSchema } from "src/hooks/useCreateForm";
import { formFiledType } from "../formFieldType";
import centerType from "./centerType";

export const centerForm: SectionSchema[] = [
  {
    title: "",
    key: "canterSection",
    items: [
      {
        key: "center_type",
        label: "نوع مرکز درمانی",
        component: (props) =>
          formFiledType.autoComplete({
            ...props,
            options: centerType,
            sx: {
              "& .MuiOutlinedInput-root": {
                boxShadow: "0px 1px 19px -2px #0000001A",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D7DFFE",
              },
            },
          }),
        type: "autoComplete",
      },
      {
        key: "center_name",
        label: "نام مرکز درمانی",
        component: (props) =>
          formFiledType.textField({
            helperText: "در صورتی که نام مرکز درمانی اشتباه است، صحیح آن را بنویسید.",
            InputProps: {
              startAdornment: (
                <InputAdornment position="start">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.1591 3.90365C17.6358 3.47026 18.3639 3.47027 18.8407 3.90367C18.8594 3.92067 18.8838 3.94477 18.9695 4.03051C19.0553 4.11625 19.0794 4.14065 19.0964 4.15935C19.5297 4.63612 19.5297 5.36418 19.0963 5.84093C19.0793 5.85963 19.0552 5.88404 18.9695 5.96977L12.0363 12.903C11.2295 13.7097 10.9201 14.0103 10.556 14.2165C10.192 14.4226 9.77503 14.5333 8.66816 14.81L8.03055 14.9694L8.18995 14.3318C8.46667 13.2249 8.57734 12.808 8.78348 12.4439C8.98963 12.0798 9.29022 11.7704 10.097 10.9636L17.0302 4.03048C17.116 3.94474 17.1404 3.92064 17.1591 3.90365ZM19.8497 2.79374C18.8008 1.84026 17.199 1.84024 16.1501 2.79368C16.1013 2.83805 16.0495 2.88991 15.9821 2.95724L15.9696 2.96981L9.03634 9.90296L8.96279 9.97649L8.96278 9.9765C8.25442 10.6846 7.79694 11.1419 7.47819 11.7048C7.15943 12.2678 7.00267 12.8954 6.75995 13.8671L6.73474 13.968L6.27217 15.8183C6.20827 16.0738 6.28316 16.3442 6.46945 16.5305C6.65573 16.7168 6.9261 16.7917 7.18168 16.7278L9.03197 16.2652L9.13286 16.24L9.13287 16.24C10.1046 15.9973 10.7321 15.8405 11.2951 15.5218C11.8581 15.203 12.3154 14.7455 13.0234 14.0372L13.097 13.9636L20.0302 7.03043L20.0427 7.01791L20.0428 7.01783C20.1101 6.95053 20.1619 6.89869 20.2063 6.8499C21.1597 5.80103 21.1597 4.1993 20.2063 3.15042C20.162 3.1016 20.1101 3.04975 20.0428 2.98241L20.0427 2.9824L20.0302 2.96987L20.0176 2.9573L20.0176 2.95728C19.9503 2.88995 19.8985 2.8381 19.8497 2.79374ZM4 20.2502C3.58579 20.2502 3.25 20.586 3.25 21.0002C3.25 21.4144 3.58579 21.7502 4 21.7502H20C20.4142 21.7502 20.75 21.4144 20.75 21.0002C20.75 20.586 20.4142 20.2502 20 20.2502H4Z"
                      fill="#747C90"
                    />
                  </svg>
                </InputAdornment>
              ),
            },
            sx: {
              "& .MuiOutlinedInput-root": {
                boxShadow: "0px 1px 19px -2px #0000001A",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D7DFFE",
              },
            },
            ...props,
          }),
        type: "textField",
      },
    ],
  },
  {
    title: "",
    key: "addressSection",
    items: [
      {
        key: "current_address",
        label: "آدرس فعلی",
        component: (props: TextFieldProps) =>
          formFiledType.textField({
            ...props,
            multiline: true,
            sx: {
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#e6ebfa",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e6ebfa",
              },
            },
          }),
        type: "textField",
        deleteble: true,
      },
    ],
    extendable: true,
    addButtonText: "افزودن آدرس جدید",
    limitExtend: 1,
  },
  {
    title: "",
    key: "phoneSection",
    items: [
      {
        key: "phone_number",
        label: "شماره تماس",
        component: (props: TextFieldProps) =>
          formFiledType.textField({
            ...props,
            sx: {
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#e6ebfa",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e6ebfa",
              },
            },
          }),
        type: "textField",
        deleteble: true,
      },
    ],
    extendable: true,
    addButtonText: "افزودن شماره تماس دیگری",
    limitExtend: Infinity,
  },
];
