import Text from '@/components/atom/text';
import Image from 'next/image';
import AccordingMenu from '../../atom/accordingMenu/accordingMenu';
import { footerForDoctors, footerForUsers, footerPaziresh24 } from './data/link';
import socials from './data/social.json';

const Footer = () => {
  return (
    <footer className="bg-white text-slate-700 p-4 mt-14 ">
      <div className="max-w-screen-xl mx-auto p-4">
        <div className="grid grid-cols-12 grid-rows-1 gap-2 ">
          <div className="col-span-12 md:col-span-5">
            <div className="flex flex-col justify-center gap-2">
              <div className="flex flex-row gap-3 items-center justify-center md:justify-start">
                <Image src="/image/logo.svg" alt="پذیرش 24" width={60} height={60} />
                <Text className="text-brand" fontSize="xl" fontWeight="black">
                  پذیرش 24
                </Text>
              </div>
              <div className="flex flex-col justify-center md:justify-start ">
                <Text as="p" className="mb-6  text-center md:text-start " fontWeight="medium" fontSize="sm">
                  تجربه مشاوره آنلاین و دریافت نوبت از بهترین پزشکان و بیمارستان‌های ایران
                </Text>
              </div>
              <ul className="flex flex-row justify-center gap-2 md:justify-start">
                {socials.map(social => {
                  return (
                    <li key={social.id}>
                      <a href={social.url} rel={social.rel} target={social.target} title={social.title}>
                        <Image src={social.src} alt={social.title} width={30} height={30} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="col-span-12 md:col-span-7">
            <div className="flex flex-wrap flex-col justify-center gap-2 md:flex-row md:justify-start">
              <AccordingMenu title={footerForUsers.title} items={footerForUsers.links} />
              <AccordingMenu title={footerForDoctors.title} items={footerForDoctors.links} />
              <AccordingMenu title={footerPaziresh24.title} items={footerPaziresh24.links} />
              <div className="flex flex-col items-center justify-center mt-2 md:basis-[49%]">
                <div className="flex flex-row items-center justify-center">
                  <span className="inline-block w-20 h-20">
                    <a href="/home/about-us/">
                      <svg
                        className="overflow-hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24.96 23.63"
                        data-v-7509daff=""
                      >
                        <title data-v-7509daff="">icon</title>{' '}
                        <g data-v-7509daff="">
                          <g data-v-7509daff="">
                            <g data-v-7509daff="">
                              <path
                                d="M2.38,4.41H8.09L4.51,19.2s-.73,2.68.72,3.54C1.35,20.92-.59,18.28.16,14.35S2.38,4.41,2.38,4.41Z"
                                fill="currentColor"
                                data-v-7509daff=""
                              ></path>{' '}
                              <path
                                d="M19.64,4.41H25L22.67,14.92s-.9,5-8.89,7.82a5,5,0,0,0,2.38-3.29C16.89,16.9,19.64,4.41,19.64,4.41Z"
                                fill="currentColor"
                                data-v-7509daff=""
                              ></path>{' '}
                              <path
                                d="M15,0S6.55,5.39,6.73,13.88a16.22,16.22,0,0,0,2.9,9.75S2,10.78,16.82,4.7C16.27,2.9,15,0,15,0Z"
                                fill="currentColor"
                                data-v-7509daff=""
                              ></path>{' '}
                              <path
                                d="M13.78,7,17,5.32s3.77,9.91-6.9,18.22C10.06,23.54,19.37,16.21,13.78,7Z"
                                fill="currentColor"
                                data-v-7509daff=""
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </a>
                  </span>
                  <span className="inline-block w-20 h-20">
                    <a href="/home/about-us/">
                      <svg
                        id="rgvjoeukjxlzfukzjxlz"
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 21.65 21.44"
                        className="icn"
                        data-v-7509daff=""
                      >
                        <title data-v-7509daff="">icon</title>{' '}
                        <g data-v-7509daff="">
                          <g data-v-7509daff="">
                            <path
                              d="M21.65,10.66a7.66,7.66,0,0,1-.43.86,5,5,0,0,0-.92,3.62,1.37,1.37,0,0,1-.94,1.57,4.82,4.82,0,0,0-2.55,2.59,1.41,1.41,0,0,1-1.6.93,6.14,6.14,0,0,0-3.81,1.05,1.38,1.38,0,0,1-1.32,0,5.76,5.76,0,0,0-3.93-1,1.19,1.19,0,0,1-1.34-.8A6.06,6.06,0,0,0,2,16.58a1.48,1.48,0,0,1-.72-1.22,6.71,6.71,0,0,0-1.08-4,1.35,1.35,0,0,1,0-1.22,6.09,6.09,0,0,0,1.06-4A1.2,1.2,0,0,1,2,4.77,5.25,5.25,0,0,0,4.77,2a1.22,1.22,0,0,1,1.42-.82A5.78,5.78,0,0,0,10,.17a1.6,1.6,0,0,1,1.4,0,6.59,6.59,0,0,0,3.94,1,1.44,1.44,0,0,1,1.22.72,6.8,6.8,0,0,0,3,2.93,1.45,1.45,0,0,1,.68,1,6.18,6.18,0,0,0,1.16,4.31A3.2,3.2,0,0,1,21.65,10.66ZM16.4,12.45a6.49,6.49,0,0,0-1.54.19,11.72,11.72,0,0,0-1.75.92A38.65,38.65,0,0,1,9,15.9a2,2,0,0,1-3-2.05,25.58,25.58,0,0,1,.38-2.71c.09-.74.58-.75,1.08-.6.71.2,1.38.52,2.09.74a2.53,2.53,0,0,0,3.27-1.07l-5-1.4.32-1L4.73,10.91,6,10.63a44.51,44.51,0,0,0-.58,4.62c-.06,2.16,1.08,3,3.14,2.32a17.57,17.57,0,0,0,3.65-2.11C13.56,14.55,14.87,13.54,16.4,12.45ZM8.12,18.54c1.38.93,2.47,1,3.49.28.77-.55,1.48-1.19,2.22-1.78,1.25-1,2.17-2.46,3.91-2.78A1.13,1.13,0,0,0,16,13.89c-.83.54-1.64,1.1-2.42,1.71C11.93,16.87,10.45,18.38,8.12,18.54Zm2.06-17c-1.52,2-1.52,2.07-.1,3.58C11.67,3.38,11.45,2.91,10.18,1.57ZM9.86,6.28c.77.07,1.93-.14,2.67.32s.94,1.57,1.32,2.28a2.71,2.71,0,0,0-.31-3.09C12.78,5.2,10.72,5.57,9.86,6.28Z"
                              fill="currentColor"
                              data-v-7509daff=""
                            ></path>
                          </g>
                        </g>
                      </svg>
                    </a>
                  </span>
                  <span className="inline-block w-20 h-20">
                    <a href="/home/about-us/">
                      <svg
                        id="llydaurzo5MF98lEyv8o"
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 29.3 23.38"
                        className="icn"
                        data-v-7509daff=""
                      >
                        <title data-v-7509daff="">icon</title>{' '}
                        <g data-v-7509daff="">
                          <g data-v-7509daff="">
                            <g data-v-7509daff="">
                              <path
                                d="M0,22.39a52,52,0,0,1,9.54-5.67c5.21-2.31,10.17-6.09,10.17-11.09S17.65,0,16.43,0C14.75,0,9.87,2,8.32,10.46s1.89,12.72,4.79,12.89,4.07-.49,5.88-4.27c1.71-1.28,3.16-1.64,3.55-3.48a.85.85,0,0,0-.76-1L21,14.5a2.46,2.46,0,0,1,1.68-1.18c1.13-.17,1.89-2.14,1.89-2.14s-4,.79-6.39,6.51-7,2.94-7.39.63A19.88,19.88,0,0,1,12.69,4.58c2.63-4.58,8.07-1,2.63,5.46C10,15.34.46,17.31,0,22.39Z"
                                fill="currentColor"
                                data-v-7509daff=""
                              ></path>{' '}
                              <path
                                d="M25.58,11.78l1,1.67a.65.65,0,0,0,1,.15l1.51-1.33a.67.67,0,0,0,.12-.83l-1-1.64a.65.65,0,0,0-1-.15L25.7,11A.66.66,0,0,0,25.58,11.78Z"
                                fill="currentColor"
                                data-v-7509daff=""
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </a>
                  </span>
                </div>
                <div className="max-w-lg text-sm">
                  <Text as="p" align="center">
                    تمامی حقوق مادی و معنوی این وب‌سایت، خدمات و محتوای مربوط به آن متعلق به شرکت سپهرسلامت می‌باشد
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
