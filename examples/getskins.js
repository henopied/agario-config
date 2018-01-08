const request = require('request-promise-native');
const MiniclipConfig = require('..');
const path = require('path');
const fs = require('fs-then-native');

(async () => {
  const skinDir = path.resolve(__dirname, 'skins');
  if (!fs.existsSync(skinDir)) fs.mkdir(skinDir);

  const miniclipConfig = new MiniclipConfig();
  await miniclipConfig.fetchInfo();
  const freeSkins = miniclipConfig.config['Gameplay - Free Skins'];
  const premiumSkins = miniclipConfig.config['Gameplay - Equippable Skins'];

  freeSkins.forEach(downloadSkin);
  premiumSkins.forEach(downloadSkin);

  async function downloadSkin({ image }) {
    url = image.replace(/\.png/, '_hi.png');
    let download = null;
    try {
      download = await request({ url: `${miniclipConfig.baseURL}/${url}`, encoding: null});
    } catch(e) {
      console.log(`Error downloading ${url}: ${e}`);
      return;
    }
    const location = path.resolve(skinDir, image);
    await fs.writeFile(location, download);
  }
})();
