export class RotatedIcon {
  constructor(options) {
    this.options = options || {};
    this.rImg = options.img || new Image();
    this.rImg.src = this.rImg.src || this.options.url || '';
    this.options.width = this.options.width || this.rImg.width || 64;
    this.options.height = this.options.height || this.rImg.height || 64;
    this.canvas = document.createElement('canvas');
    this.canvasSize =
      this.options.width > this.options.height
        ? this.options.width
        : this.options.height;
    this.yOffset = (this.canvasSize - this.options.height) / 2;
    this.xOffset = (this.canvasSize - this.options.width) / 2;
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;
    this.context = this.canvas.getContext('2d');
  }

  static makeIcon(url) {
    return new RotatedIcon({ url: url });
  }

  setRotation(options) {
    const canvas = this.context;
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
    return this.canvas.toDataURL('image/png');
  }
}
