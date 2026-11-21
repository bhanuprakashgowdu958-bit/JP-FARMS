const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'drcftm7m',
  api_key: '354734745383935',
  api_secret: 'GzN7HoDD21d9GJMG4m71T8pmacg',
  secure: true,
});

const BANNERS_TO_UPLOAD = [
  'ad_rooster_golden_grains_wide.jpg',
  'winter_storybook_rooster_wide.jpg',
  'banner_rainbow_wings_crow.jpg',
  'banner_alpha_warrior_staredown.jpg',
  'midday_4_farm_stream.jpg',
  'night_2_black_kadaknath.jpg',
  'morning_1_sunrise_crow.jpg',
  'evening_1_sunset_wagon.jpg',
  'signup_roosters_battle.jpg',
];

async function uploadBanners() {
  console.log('🚀 Starting Cloudinary upload for JP Farms banners...');
  const results = {};

  for (const filename of BANNERS_TO_UPLOAD) {
    const localPath = path.join(__dirname, '..', 'public', 'banners', filename);
    if (!fs.existsSync(localPath)) {
      console.log(`⚠️ File not found locally: ${localPath}`);
      continue;
    }

    const publicId = path.parse(filename).name;
    console.log(`Uploading ${filename}...`);

    try {
      const res = await cloudinary.uploader.upload(localPath, {
        folder: 'jp-farms/banners',
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });
      console.log(`✅ Uploaded: ${filename} -> ${res.secure_url}`);
      results[filename] = res.secure_url;
    } catch (err) {
      console.error(`❌ Failed uploading ${filename}:`, err.message);
    }
  }

  const outputPath = path.join(__dirname, 'cloudinary-banner-map.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n🎉 Upload complete! Saved mapping to: ${outputPath}`);
}

uploadBanners();
