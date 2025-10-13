// src/utils/ManageImage.js
export function compressImage(file, targetW, targetH, quality = 0.82) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const revoke = (url) => URL.revokeObjectURL(url);
        img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetW; canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        const r = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight);
        const w = img.naturalWidth * r;
        const h = img.naturalHeight * r;
        const x = (targetW - w) / 2;
        const y = (targetH - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        resolve(canvas.toDataURL("image/webp", quality));
        };
        img.onerror = reject;
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
        img.onloadend = () => revoke(objectUrl);
    });
}