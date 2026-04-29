import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

(async () => {
    // Cari semua file jpg, jpeg, png di folder assets tapi BUKAN di assets/optimized
    const files = globSync('assets/**/*.{jpg,jpeg,png}', { ignore: 'assets/optimized/**' });
    let count = 0;

    for (const file of files) {
        // Ganti path separator agar aman di Windows
        const normalizedFile = file.replace(/\\/g, '/');
        const relativePath = normalizedFile.replace('assets/', '');
        const newPath = path.join('assets/optimized', relativePath)
            .replace(/\.(jpg|jpeg|png)$/i, '.webp');

        // bikin folder kalau belum ada
        fs.mkdirSync(path.dirname(newPath), { recursive: true });

        try {
            // Resize image (max width 1000px) and convert to WebP with 60% quality
            await sharp(file)
                .resize({ width: 1000, withoutEnlargement: true })
                .webp({ quality: 60 })
                .toFile(newPath);
            count++;
        } catch (err) {
            console.error(`Gagal memproses ${file}:`, err);
        }
    }

    console.log(`✅ ${count} gambar berhasil di-resize & convert ke WebP!`);
})();