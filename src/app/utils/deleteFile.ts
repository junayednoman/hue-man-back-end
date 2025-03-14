import fs from "fs";
import path from "path";

/**
 * Deletes a file from the uploads folder
 * @param filePath - The relative path to the file to be deleted (e.g., "/images/example.jpg")
 * @returns A promise that resolves when the file is deleted or rejects with an error
 */
export const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(filePath);

    fs.unlink(absolutePath, (err) => {
      if (err) {
        return reject(new Error(`Failed to delete file: ${err.message}`));
      }
      resolve();
    });
  });
};
