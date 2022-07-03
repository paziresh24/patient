import { render } from '@testing-library/react';

import Rate from './rate';

describe('Rate', () => {
    it('should rate link in a tag', () => {
        const link =
            'https://www.paziresh24.com/doctors-survey/?userID=521016&pname=%D8%B3%D8%AD%D8%B1%20%D8%AB%D9%86%D8%A7%DB%8C%DB%8C&pID=0522bd27-96f1-11ec-8b49-005056ade667&consCode=05981c8f-96f1-11ec-8b49-005056ade667&docName=%D8%A7%D8%AD%D8%B3%D8%A7%D9%86%20%D8%A7%DA%A9%D8%A8%D8%B1%D8%B2%D8%A7%D8%AF%D9%87&docID=c0340b9b-e467-11ea-bed6-005056b09c11&docGexp&docSID=1&refID=1746443365&userCell=9104490454&bookDate=%DB%B1%DB%B4%DB%B0%DB%B0-%DB%B1%DB%B2-%DB%B0%DB%B7&bookTime=%DB%B1%DB%B4%3A%DB%B1%DB%B5&docNameU=%D8%A7%D8%AD%D8%B3%D8%A7%D9%86_%D8%A7%DA%A9%D8%A8%D8%B1%D8%B2%D8%A7%D8%AF%D9%87&bookType=%D9%88%D8%A8%20%DA%A9%D9%84%DB%8C%D9%86%DB%8C%DA%A9';
        const { baseElement } = render(<Rate link={link} />);
        expect(baseElement.querySelector('a').href).toBe(link);
    });
});
