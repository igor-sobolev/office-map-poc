export class RotatableIcon {
  constructor(options) {
    this.options = options || {};
    this.canvas = document.createElement('canvas');
  }

  static makeIcon(url) {
    return new RotatableIcon({ url: url });
  }

  load() {
    return new Promise((resolve, reject) => {
      this.rImg = this.options.img || new Image();
      this.rImg.src = this.rImg.src || this.options.url || '';
      this.rImg.onload = () => {
        this.options.width = this.options.width || this.rImg.width || 64;
        this.options.height = this.options.height || this.rImg.height || 64;
        this.canvasSize = Math.sqrt(
          this.options.width * this.options.width +
            this.options.height * this.options.height
        );
        this.yOffset = (this.canvasSize - this.options.height) / 2;
        this.xOffset = (this.canvasSize - this.options.width) / 2;
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;
        this.loaded = true;
        resolve();
      };
      this.rImg.onerror = () => reject();
    });
  }

  setRotation(options) {
    if (!this.loaded) console.error('Load image first');

    const canvas = this.canvas.getContext('2d');
    const angle = options.deg ? (options.deg * Math.PI) / 180 : options.rad;
    const centerX = this.canvasSize / 2;
    const centerY = this.canvasSize / 2;

    canvas.clearRect(0, 0, this.canvasSize, this.canvasSize);
    canvas.save();
    canvas.translate(centerX, centerY);
    canvas.rotate(angle);
    canvas.translate(-centerX, -centerY);
    canvas.drawImage(this.rImg, this.xOffset, this.yOffset);
    canvas.restore();

    return this;
  }

  getUrl() {
    if (!this.loaded) console.error('Load image first');

    return this.canvas.toDataURL('image/png');
  }
}
