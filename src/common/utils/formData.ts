export const formData = (params: any) => {
  const dt = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach(item => {
        dt.append(`${key}[]`, item as any);
      });
    } else {
      dt.append(key, value as any);
    }
  }
  return dt;
};

export default formData;
