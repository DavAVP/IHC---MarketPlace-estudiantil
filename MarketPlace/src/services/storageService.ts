import { supabase } from "../data/supabase.config";

// Tipos de respuestas
type UploadSuccess = {
  publicUrl: string;
  path: string;
};

type UploadError = {
  error: Error;
};

type UploadResponse = UploadSuccess | UploadError;

/**
 * 🔹 Sube un archivo (imagen) a Supabase Storage.
 * @param file - El archivo a subir.
 * @param bucketName - Nombre del bucket (por ejemplo: 'ImagenesProductos').
 * @param filePath - Ruta dentro del bucket (por ejemplo: 'productos/userid/nombre.png').
 */
export async function uploadFile(
  file: File,
  bucketName: string,
  filePath: string
): Promise<UploadResponse> {
  console.log("Subiendo archivo:", { fileName: file.name, bucketName, filePath });

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error al subir el archivo:", uploadError);
    return { error: new Error(uploadError.message || "Fallo la subida del archivo.") };
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    console.error("Error al obtener la URL pública:", publicUrlData);
    return { error: new Error("Error al obtener la URL pública después de la subida.") };
  }

  console.log("Archivo subido exitosamente:", publicUrlData.publicUrl);

  return { publicUrl: publicUrlData.publicUrl, path: uploadData.path };
}

/**
 * 🔹 Elimina un archivo del bucket de Supabase Storage.
 * @param path - Ruta exacta del archivo en el bucket.
 * @param bucketName - Nombre del bucket (por defecto: 'ImagenesProductos').
 */
export async function deleteFile(
  path: string,
  bucketName = "ImagenesProductos"
): Promise<boolean> {
  if (!path) {
    console.error("No se proporcionó una ruta válida para eliminar el archivo.");
    return false;
  }

  const { error } = await supabase.storage.from(bucketName).remove([path]);

  if (error) {
    console.error("Error al eliminar el archivo del Storage:", error.message);
    return false;
  }

  console.log("Archivo eliminado correctamente:", path);
  return true;
}
