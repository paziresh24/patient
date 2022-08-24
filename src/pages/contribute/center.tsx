/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Head from "next/head";
import Button from "@mui/material/Button";
import Modal from "@/components/atoms/modal";
import { CenterInfoData, EditCenterInfo } from "@/components/organisms/contribute/editCenterInfo";
import { PhoneCenter, phoneData } from "@/components/organisms/contribute/editPhoneCenter";
import TopBar from "@/components/layouts/appBar";
import { TextFieldProps } from "@mui/material";

import { centerForm } from "@/schemas/contributeForm/centerForm";
import centerType from "@/schemas/contributeForm/centerType";
import { useCreateForm } from "src/hooks/useCreateForm";
import { formFiledType } from "src/schemas/formFieldType";
import { useProfileDataStore } from "src/store/profileData";
import { splunkInstance } from "@/services/splunk";

const Home: NextPage = () => {
  const router = useRouter();
  const { Form, handleSubmit, addField, setDefaultValue } = useCreateForm(centerForm);
  const [addressModal, setAddressModal] = useState(false);
  const [addPhoneModal, setAddPhoneModal] = useState(false);
  const [userEntredAddressCenter, setUserEntredAddressCenter] = useState<CenterInfoData>({});
  const profileData = useProfileDataStore((state) => state.data);
  const selectedCenter = useProfileDataStore((state) => state.selectedCenter);

  useEffect(() => {
    setDefaultValue({
      center_name: selectedCenter.name,
      current_address: selectedCenter.address,
      phone_number: selectedCenter?.tell_array?.[0],
      center_type: selectedCenter.center_type === 1 ? centerType[0] : centerType[1],
    });
  }, []);

  const addAddress = (data: CenterInfoData) => {
    setAddressModal(false);
    setUserEntredAddressCenter(data);
    addField({
      sectionKey: "addressSection",
      item: {
        key: "userEntredAddress",
        component: (props: TextFieldProps) =>
          formFiledType.textField({
            ...props,
            multiline: true,
            sx: {
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#dbf3ec",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#BDF0E0",
              },
            },
          }),
        type: "textField",
        deleteble: true,
      },
      defaultValue: data.address,
    });
  };

  const addPhoneNumber = (phoneNumber: phoneData) => {
    if (!phoneNumber) return;
    setAddPhoneModal(false);
    addField({
      sectionKey: "phoneSection",
      item: {
        key: "phone_number",
        component: (props: TextFieldProps) =>
          formFiledType.textField({
            ...props,
            sx: {
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#dbf3ec",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#BDF0E0",
              },
            },
          }),
        type: "textField",
        deleteble: true,
      },
      defaultValue: phoneNumber,
    });
  };

  const onSubmit = (data: any) => {
    const dataEvent = {
      ...data,
      center_type: data.center_type.label,
      userEntredAddressCenter: {
        ...userEntredAddressCenter,
        city: userEntredAddressCenter.city?.label,
        province: userEntredAddressCenter.province?.label,
      },
    };
    splunkInstance.sendEvent({
      group: "contribute crowdsourcing",
      type: "contribute doctor profile request edit",
      event: { ...dataEvent },
    });
    router.push({
      pathname: "/contribute/thank-you",
      query: { ...router.query },
    });
  };

  return (
    <div>
      <Head>
        <title>ویرایش اطلاعات مرکز درمانی {profileData.display_name}</title>
      </Head>

      <TopBar title={`ویرایش اطلاعات مرکز درمانی ${profileData.display_name}`} backButton />
      <main className="flex flex-col p-5 pb-28">
        <Form
          actionExtend={{
            addressSection: () => setAddressModal(true),
            phoneSection: () => setAddPhoneModal(true),
          }}
        />
        <div className="bg-white fixed bottom-0 right-0 w-full p-4 shadow-lg">
          <Button fullWidth variant="contained" onClick={handleSubmit(onSubmit)}>
            ثبت
          </Button>
        </div>
      </main>
      <Modal isOpen={addressModal} onClose={setAddressModal}>
        <EditCenterInfo
          onSubmit={addAddress}
          onCancel={() => setAddressModal(false)}
          defaultValues={{
            province: { label: selectedCenter.province },
            city: { label: selectedCenter.city },
            lat: +selectedCenter?.map?.lat!,
            lng: +selectedCenter?.map?.lon!,
          }}
        />
      </Modal>
      <Modal isOpen={addPhoneModal} onClose={setAddPhoneModal}>
        <PhoneCenter onSubmit={addPhoneNumber} onCancel={() => setAddPhoneModal(false)} />
      </Modal>
    </div>
  );
};

export default Home;
