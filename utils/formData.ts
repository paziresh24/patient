export const formData = (params: any) => {
  const dt = new FormData();
  for (const [key, value] of Object.entries(params)) {
    dt.append(key, value as any);
  }
  return dt;
};

export default formData;
