import { supabase } from '../data/supabase.config';

// Definir el tipo de la respuesta exitosa
type UploadSuccess = {
    publicUrl: string;
    path: string;
};

// Definir el tipo de la respuesta con error
type UploadError = {
    error: Error;
};

// Tipo de la respuesta de la función de subida
type UploadResponse = UploadSuccess | UploadError;

/**
 * Sube un archivo (File) a Supabase Storage.
 * @param {File} file - El objeto File (imagen) a subir.
 * @param {string} bucketName - Nombre del bucket.
 * @param {string} filePath - Ruta y nombre del archivo dentro del bucket.
 * @returns {Promise<UploadResponse>} - URL pública y path o un objeto de error.
 */

export async function uploadFile(
    file: File, 
    bucketName: string, 
    filePath: string
): Promise<UploadResponse> {
    console.log('Subiendo archivo:', { fileName: file.name, bucketName, filePath }); // Log de inicio

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (uploadError) {
        console.error('Error al subir el archivo:', uploadError);
        return { error: new Error(uploadError.message || 'Fallo la subida del archivo.') };
    }

    console.log('Archivo subido exitosamente:', uploadData); // Log de éxito

    const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error('Error al obtener la URL pública:', publicUrlData);
        return { error: new Error('Error al obtener la URL pública después de la subida.') };
    }

    return { publicUrl: publicUrlData.publicUrl, path: uploadData.path };
}