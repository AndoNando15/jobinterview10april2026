import imagemin from 'imagemin';
import webp from 'imagemin-webp';
import fs from 'fs';
import path from 'path';

(async () => {
    const inputFiles = await imagemin(['assets/**/*.{jpg,jpeg,png}'], {
        plugins: [
            webp({ quality: 75 })
        ]
    });

    inputFiles.forEach(file => {
        const relativePath = file.sourcePath.replace('assets/', '');
        const newPath = path.join('assets/optimized', relativePath)
            .replace(/\.(jpg|jpeg|png)$/i, '.webp');

        // bikin folder kalau belum ada
        fs.mkdirSync(path.dirname(newPath), { recursive: true });

        // simpan file
        fs.writeFileSync(newPath, file.data);
    });

    console.log(`✅ ${inputFiles.length} gambar berhasil di-convert + struktur folder dipertahankan`);
})();