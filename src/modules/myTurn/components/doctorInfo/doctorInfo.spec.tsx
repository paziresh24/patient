import { cleanup, render, RenderResult } from '@testing-library/react';

import DoctorInfo from './doctorInfo';

let documentBody: RenderResult;

describe('Doctor Info', () => {
  beforeEach(() => {
    documentBody = render(
      <DoctorInfo
        firstName="امیرحسین"
        lastName="بیگی"
        expertise="پزشک عمومی"
        avatar="https://www.paziresh24.com/api/getImage/p24/search-men/d418ce9cfb1df336bad5b3c48bc03f1e.jpg"
      />,
    );
  });
  it('should show formatted firstName and lastName', () => {
    const { getByTestId } = documentBody;
    expect(getByTestId('doctor-info__full-name').innerHTML).toEqual('امیرحسین بیگی');
  });
  it('should show expertise', () => {
    const { getByTestId } = documentBody;
    expect(getByTestId('doctor-info__expertise')).toBeTruthy();
  });
  it('should remove expertise container when not expertise', () => {
    cleanup();
    const { queryByTestId } = render(
      <DoctorInfo
        firstName="امیرحسین"
        lastName="بیگی"
        avatar="https://www.paziresh24.com/api/getImage/p24/search-men/d418ce9cfb1df336bad5b3c48bc03f1e.jpg"
      />,
    );
    expect(queryByTestId('doctor-info__expertise')).toBeNull();
  });
});
