const QRCode = require('qrcode');
const generateQRCode = (link) => {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(link, { errorCorrectionLevel: 'H', type: 'image/png' }, (err, url) => {
            if (err) {
                reject(err); // Reject the promise if there's an error
            } else {
                resolve(url); // Resolve the promise with the QR code as a data URL
            }
        });
    });
};

export { generateQRCode }