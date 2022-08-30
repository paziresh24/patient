import Autocomplete from '@/common/components/atom/autocomplete';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField';
import cities from '@/common/constants/places/city.json';
import provinces from '@/common/constants/places/province.json';
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
  city?: string;
  province?: string;
  removed?: boolean;
};

export const EditCenterInfo = ({ onSubmit, onCancel, defaultValues }: EditCenterInfoProps) => {
  const [dataAddress, setDataAddress] = useState<CenterInfoData>({
    address: '',
    lat: 0,
    lng: 0,
    city: '',
    province: '',
  });
  const [mapZoom, setMapZoom] = useState(20);

  useEffect(() => {
    const latSelcted =
      cities.find(({ name }) => name === dataAddress?.city)?.lat ?? provinces.find(({ name }) => name === dataAddress?.province)?.lat;
    const lngSelcted =
      cities.find(({ name }) => name === dataAddress?.city)?.lon ?? provinces.find(({ name }) => name === dataAddress?.province)?.lon;
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
        city: defaultValues?.city ? defaultValues?.city : prev?.city,
        province: defaultValues?.province ? defaultValues?.province : prev?.province,
      }));
    }
  }, [defaultValues]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-s-3">
        <Autocomplete
          label="استان"
          size="small"
          options={provinces.map(item => ({ label: item.name, value: item.id }))}
          onChange={value => setDataAddress(prev => ({ ...prev, province: value.label }))}
          value={dataAddress.province}
        />
        <Autocomplete
          label="شهر"
          size="small"
          options={cities.filter(item => item.province === dataAddress?.province).map(item => ({ label: item.name, value: item.id }))}
          onChange={value => setDataAddress(prev => ({ ...prev, city: value.label }))}
          value={dataAddress.city}
        />
      </div>
      <TextField
        value={dataAddress.address}
        onChange={e => setDataAddress(prev => ({ ...prev, address: e.target.value }))}
        placeholder="آدرس محاوره ای مرکز درمانی، به آدرس پستی آن ارجحیت دارد."
        multiLine
        size="small"
      />
      <div className="h-40 overflow-hidden rounded-lg">
        <Map
          lat={dataAddress.lat ?? 0}
          lng={dataAddress.lng ?? 0}
          sendPosition={({ lat, lng }: { lat: number; lng: number }) => setDataAddress(prev => ({ ...prev, lat, lng }))}
          zoom={mapZoom}
        />
      </div>
      <div className="flex space-s-3">
        <Button
          variant="primary"
          block
          disabled={!dataAddress.city || !dataAddress.province || !dataAddress.address}
          onClick={() => onSubmit(dataAddress)}
          className="bg-green-600 border-green-600"
        >
          ثبت آدرس
        </Button>
        <Button block variant="secondary" onClick={onCancel}>
          انصراف
        </Button>
      </div>
    </div>
  );
};

export default EditCenterInfo;
