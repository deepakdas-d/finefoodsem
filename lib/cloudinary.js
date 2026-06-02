export async function uploadToCloudinary(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
        const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || errorData.message || "Upload failed");
        }

        const data = await response.json();
        return {
            imageUrl: data.secure_url,
            publicId: data.public_id,
        };
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        throw err;
    }
}

export async function deleteFromCloudinary(publicId) {
    if (!publicId) return;

    // Note: Deleting from client-side requires a signature or using a Cloud Function.
    // For simplicity and security, we'll mark this as a server-side task or 
    // suggest the user implement a backend endpoint for deletion.
    console.warn("Client-side deletion from Cloudinary requires a backend endpoint for security.");
}
