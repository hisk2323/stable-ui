
/**
 * Converts base64 data into to another data type
 */
export async function convertBase64ToDataType(base64Image: string, contentType: string) {    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = base64Image;

    await new Promise(resolve => image.onload = resolve);

    canvas.width = image.width;
    canvas.height = image.height;

    ctx?.drawImage(image, 0, 0);

    const dataURL = canvas.toDataURL(contentType);
    return dataURL;
}

/**
 * Converts base64 data into a Uint8Array
 */
export async function convertBase64ToUint8Array(base64Image: string, contentType?: string) {
    // Split into two parts
    const parts = base64Image.split(';base64,');

    // Hold the content type
    const imageType = contentType ?? parts[0].split(':')[1];

    // Decode Base64 string
    const decodedData =
        window.atob(
            imageType === parts[0].split(':')[1] ?
                parts[1] :
                (await convertBase64ToDataType(base64Image, imageType)).split(',')[1]
        );


    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
    }

    return uInt8Array;
}

/**
 * Converts base64 data into a blob
 */
export async function convertBase64ToBlob(base64Image: string, contentType?: string) {
    // Hold the content type
    const imageType = contentType ?? base64Image.split(';base64,')[0].split(':')[1];
    
    // Get Uint8Array
    const uInt8Array = await convertBase64ToUint8Array(base64Image, contentType)

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
}

/**
 * Converts a blob/file into base64 data
 */
export function convertToBase64(data: Blob | File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error);
        reader.readAsDataURL(data);
    })
}
