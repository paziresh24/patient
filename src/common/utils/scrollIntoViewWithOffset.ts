export const scrollIntoViewWithOffset = (selector: any, offset: number) => {
  window.scrollTo({
    behavior: 'smooth',
    top: document.querySelector(selector)?.getBoundingClientRect()?.top - document.body.getBoundingClientRect().top - offset,
  });
};

export default scrollIntoViewWithOffset;
