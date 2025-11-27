const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public/images/gallery');
const outputDir = path.join(__dirname, 'public/images/gallery-optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get all jpg files
const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.jpg'));

console.log(`Optimizing ${files.length} images...`);

Promise.all(
    files.map(async (file) => {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);

        try {
            await sharp(inputPath)
                .resize(1200, 1200, { // Max 1200px width/height
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80 }) // 80% quality
                .toFile(outputPath);

            const inputSize = fs.statSync(inputPath).size;
            const outputSize = fs.statSync(outputPath).size;
            const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

            console.log(`✓ ${file}: ${(inputSize / 1024 / 1024).toFixed(2)}MB → ${(outputSize / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`);
        } catch (error) {
            console.error(`✗ Error processing ${file}:`, error.message);
        }
    })
).then(() => {
    console.log('\nOptimization complete! Now run:');
    console.log('rm -rf public/images/gallery');
    console.log('mv public/images/gallery-optimized public/images/gallery');
});
