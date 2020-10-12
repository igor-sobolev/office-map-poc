export class RotatedIcon {
  constructor(options) {
    this.options = options || {};
    this.rImg = options.img || new Image();
    this.rImg.src = this.rImg.src || this.options.url || '';
    this.options.width = this.options.width || this.rImg.width || 52;
    this.options.height = this.options.height || this.rImg.height || 60;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.context = this.canvas.getContext('2d');
  }

  static makeIcon(url) {
    return new RotatedIcon({ url: url });
  }

  setRotation(options) {
    const canvas = this.context;
    const angle = options.deg ? (options.deg * Math.PI) / 180 : options.rad;
    const centerX = this.options.width / 2;
    const centerY = this.options.height / 2;

    canvas.clearRect(0, 0, this.options.width, this.options.height);
    canvas.save();
    canvas.translate(centerX, centerY);
    canvas.rotate(angle);
    canvas.translate(-centerX, -centerY);
    canvas.drawImage(this.rImg, 0, 0);
    canvas.restore();

    return this;
  }

  getUrl() {
    return this.canvas.toDataURL('image/png');
  }
}
