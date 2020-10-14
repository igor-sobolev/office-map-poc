export class ImageToBase64 {
  constructor() {
    this.cache = new Map();
  }

  async fetch(url) {
    if (this.cache.get(url)) return this.cache.get(url);
    const res = await fetch(url);
    const raw = await res.blob();
    const result = await this._blobToBase64(raw);
    if (result) this.cache.set(url, result);

    return result;
  }

  _blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}
