import { Autocomplete, Button, FormControlLabel, TextField } from '@mui/material';
import provinces from '@/common/constants/places/province.json';
import cities from '@/common/constants/places/city.json';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const Map = dynamic(() => import('@/components/atom/map'), { ssr: false });

interface EditCenterInfoProps {
  onSubmit: (data: CenterInfoData) => void;
  onCancel: () => void;
  defaultValues?: CenterInfoData;
}

export type CenterInfoData = {
  address?: string;
  lat?: number;
  lng?: number;
  city?: {
    label?: string;
    value?: string;
  } | null;
  province?: {
    label?: string;
    value?: string;
  } | null;
};

export const EditCenterInfo = ({ onSubmit, onCancel, defaultValues }: EditCenterInfoProps) => {
  const [dataAddress, setDataAddress] = useState<CenterInfoData>({
    address: '',
    lat: 0,
    lng: 0,
    city: null,
    province: null,
  });
  const [mapZoom, setMapZoom] = useState(20);

  useEffect(() => {
    const latSelcted =
      cities.find(({ id }) => id === dataAddress?.city?.value)?.lat ?? provinces.find(({ id }) => id === dataAddress?.province?.value)?.lat;
    const lngSelcted =
      cities.find(({ id }) => id === dataAddress?.city?.value)?.lon ?? provinces.find(({ id }) => id === dataAddress?.province?.value)?.lon;
    if (latSelcted && lngSelcted) {
      setDataAddress(prev => ({
        ...prev,
        lat: +latSelcted,
        lng: +lngSelcted,
      }));
      setMapZoom(10);
    }
  }, [dataAddress.city, dataAddress.province]);

  useEffect(() => {
    if (defaultValues) {
      setDataAddress(prev => ({
        ...prev,
        ...defaultValues,
        city: defaultValues?.city?.label ? defaultValues?.city : prev?.city,
        province: defaultValues?.province?.label ? defaultValues?.province : prev?.province,
      }));
    }
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-s-3">
        <FormControlLabel
          control={
            <Autocomplete
              disablePortal
              fullWidth
              options={provinces.map(item => ({ label: item.name, value: item.id }))}
              renderInput={(params: any) => <TextField {...params} fullWidth />}
              onChange={(_, value) => setDataAddress(prev => ({ ...prev, province: value }))}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              value={dataAddress.province}
            />
          }
          label="استان"
          labelPlacement="top"
          className="!items-start gap-2  w-full"
        />

        <FormControlLabel
          control={
            <Autocomplete
              disablePortal
              fullWidth
              options={cities
                .filter(item => item.province === dataAddress?.province?.label)
                .map(item => ({ label: item.name, value: item.id }))}
              renderInput={(params: any) => <TextField {...params} fullWidth />}
              onChange={(_, value) => setDataAddress(prev => ({ ...prev, city: value }))}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              value={dataAddress.city}
            />
          }
          label="شهر"
          labelPlacement="top"
          className="!items-start gap-2  w-full"
        />
      </div>
      <FormControlLabel
        control={
          <TextField
            multiline
            fullWidth
            placeholder="آدرس محاوره ای مرکز درمانی، به آدرس پستی آن ارجحیت دارد."
            onChange={e => setDataAddress(prev => ({ ...prev, address: e.target.value }))}
            value={dataAddress.address}
          />
        }
        label="آدرس"
        labelPlacement="top"
        className="!items-start gap-2 !mx-0 w-full"
      />
      <div className="h-40 overflow-hidden rounded-lg">
        <Map
          lat={dataAddress.lat}
          lng={dataAddress.lng}
          sendPosition={({ lat, lng }: { lat: number; lng: number }) => setDataAddress(prev => ({ ...prev, lat, lng }))}
          zoom={mapZoom}
        />
      </div>
      <div className="flex space-s-4">
        <Button
          color="success"
          fullWidth
          variant="contained"
          disabled={!dataAddress.city?.label || !dataAddress.province?.label || !dataAddress.address}
          onClick={() => onSubmit(dataAddress)}
        >
          ثبت آدرس
        </Button>
        <Button color="secondary" fullWidth variant="outlined" onClick={onCancel}>
          انصراف
        </Button>
      </div>
    </div>
  );
};

export default EditCenterInfo;
