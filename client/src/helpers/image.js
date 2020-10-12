const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(reader.result);
    };
    reader.readAsDataURL(blob);
  });

export const fetchImageAsBase64 = async (url) => {
  const res = await fetch(url);
  const raw = await res.blob();

  return blobToBase64(raw);
};
