import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { currentUser, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [displayName, setDisplayName] = useState(currentUser?.user_metadata?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(currentUser?.user_metadata?.avatar_url || '');
    const [previewUrl, setPreviewUrl] = useState(avatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser) return;

        try {
            setLoading(true);

            // Create preview
            setPreviewUrl(URL.createObjectURL(file));

            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const filePath = `${currentUser.id}/${currentUser.id}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { 
                    upsert: true,
                    contentType: file.type 
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);

        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            setLoading(true);
            await updateProfile({
                name: displayName,
                avatar_url: avatarUrl
            });
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md p-6 bg-base-100 rounded-lg shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                    <button 
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-24 h-24 group">
                            <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-primary/20">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Avatar"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-2xl font-medium text-primary">
                                            {displayName?.charAt(0) || currentUser?.email?.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-focus transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <p className="text-sm text-base-content/60">
                            Click to upload a new profile picture
                        </p>
                    </div>

                    {/* Display Name Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Display Name</span>
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="input input-bordered"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email Display */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            value={currentUser?.email}
                            disabled
                            className="input input-bordered opacity-60"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal; 