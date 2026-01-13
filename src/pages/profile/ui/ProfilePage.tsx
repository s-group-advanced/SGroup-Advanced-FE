import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@/features/providers/UserProvider";
import { FiUpload } from "react-icons/fi";  // ✅ THÊM icon
import { uploadToCloudinary } from "@/shared/lib/cloudinary";

export function ProfilePage() {
    const { user, isLoading, handleUpdateProfile } = useUser();
    const [avatarUrl, setAvatarUrl] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

    useEffect(() => {
        if (user) {
            setAvatarUrl(user.avatar_url || "");
            setFullName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setIsUploading(true);
        setUploadStatus("uploading");

        try {
            // show preview image
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setAvatarUrl(previewUrl);
            }
            reader.readAsDataURL(file);

            // upload to cloudinary
            const cloudinaryUrl = await uploadToCloudinary(file);

            setAvatarUrl(cloudinaryUrl);
            setUploadStatus("success");

            setTimeout(() => {
                setUploadStatus("idle");
            }, 3000);

        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus("error");
            alert('Failed to upload image');
            
            // rollback to previous avatar
            if (user?.avatar_url) {
                setAvatarUrl(user.avatar_url);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSaveChanges = async () => {
        if (!user?.id) {
            alert("User ID is missing");
            return;
        }
        
        // check if there are any changes, if not, return
        const hasNameChanged = fullName.trim() !== user?.name;
        const hasAvatarChanged = avatarUrl !== user?.avatar_url;
    
        if (!hasNameChanged && !hasAvatarChanged) {
            console.log("No changes to save");
            return;
        }
    
        try {
            await handleUpdateProfile({
                id: user.id,
                name: fullName.trim(),
                avatar_url: avatarUrl,
            });

            console.log("avatarUrl", avatarUrl);
            console.log("fullName", fullName);
            
            console.log("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to save changes:", err);
            console.log("Failed to update profile. Please try again.");
        }
    };

    const handleReset = () => {
        if (user) {
            setAvatarUrl(user.avatar_url || "");
            setFullName(user.name || "");
            setEmail(user.email || "");
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 border-gray-200">
                    <div className="border-gray-200 flex">
                        <h1 className="text-lg font-medium mx-4">Profile Settings</h1>
                    </div>
                </div>
                <div className="w-full h-px bg-gray-200 my-2"></div>
                <div className="px-8 py-4 flex justify-center items-center min-h-[400px]">
                    <div className="text-gray-500">Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-gray-200">
                <div className="border-gray-200 flex">
                    <h1 className="text-lg font-medium mx-4">Profile Settings</h1>
                </div>
            </div>
            <div className="w-full h-px bg-gray-200 my-2"></div>

            {/* Content Area */}
            <div className="px-8 py-4 flex justify-center items-start min-h-[calc(100vh-100px)]">
                <div className="w-full max-w-3xl">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage your account settings and profile information.
                            </p>
                        </div>

                        {/* Avatar Section */}
                        <div className="mb-6">
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                Profile Picture
                            </Label>
                            <div className="flex items-start gap-4 justify-center items-center">
                                {/* Avatar Preview */}
                                <div className={`w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative
                                    ${uploadStatus === 'success' ? 'ring-2 ring-green-500' : ''}
                                    ${uploadStatus === 'error' ? 'ring-2 ring-red-500' : ''}
                                    ${uploadStatus === 'uploading' ? 'ring-2 ring-blue-500 animate-pulse' : ''}
                                `}>
                                    <img 
                                        src={avatarUrl || "https://via.placeholder.com/150"} 
                                        alt="Profile Avatar" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/150";
                                        }}
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                                <span className="text-white text-xs">Uploading...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Controls */}
                                <div className="flex-1 space-y-3 items-center justify-center flex-col">
                                    {/* Hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    
                                    {/* Upload Button */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleUploadClick}
                                        disabled={isUploading}
                                        className="w-full sm:w-auto mt-3 ml-4"
                                    >
                                        <FiUpload className="w-4 h-4 mr-2" />
                                        {isUploading ? 'Uploading...' : 'Upload Photo'}
                                    </Button>

                                    <p className="text-xs text-gray-500 ml-4">
                                        JPG, PNG or GIF. Max size 5MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div className="mb-6">
                            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="mt-1"
                            />
                        </div>

                        {/* Email Address */}
                        <div className="mb-8">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                disabled
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="mt-1"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button 
                                onClick={handleSaveChanges}
                                className="bg-black text-white hover:bg-gray-800"
                                disabled={isUploading}
                            >
                                Save Changes
                            </Button>
                            <Button 
                                onClick={handleReset}
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                disabled={isUploading}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}