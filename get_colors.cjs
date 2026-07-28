const Jimp = require('jimp');

Jimp.read('./public/assets/logo.png')
  .then(image => {
    const colorCounts = {};
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const a = this.bitmap.data[idx + 3];
      
      if (a > 50) { // ignoring transparent pixels
        const hex = Jimp.rgbaToInt(r, g, b, 255).toString(16).padStart(8, '0').slice(0, 6);
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }
    });
    
    const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
    console.log('Top 10 colors in logo:', sorted.slice(0, 10).map(c => `#${c[0]}`));
  })
  .catch(err => {
    console.error(err);
  });
