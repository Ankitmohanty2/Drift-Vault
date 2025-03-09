import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { IFolder } from "src/hooks/useFolder";

// CONTEXTS
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

// UUID
import { v4 as uuidV4 } from "uuid";

// TS INTERFACES
import { ROOT_FOLDER } from "src/hooks/useFolder";

interface Props {
	currentFolder: IFolder;
}

const AddFileBtn: React.FC<Props> = ({ currentFolder }) => {
	const uploadFile = useRef<HTMLInputElement>(null);
	const [uploadingFiles, setUploadingFiles] = useState<Array<{id: string, name: string, progress: number}>>([]);
	const { currentUser } = useAuth();

	async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!currentFolder || !file || !currentUser?.id) return;

		const filePath = 
			currentFolder.path.length > 0
				? `${currentUser.id}/${currentFolder.path.join("/")}/${file.name}`
				: `${currentUser.id}/${file.name}`;

		try {
			// Add to uploading files with 0 progress
			setUploadingFiles(prev => [
				...prev,
				{ id: crypto.randomUUID(), name: file.name, progress: 0 }
			]);

			// Upload to Supabase Storage
			const { data, error } = await supabase.storage
				.from('files')
				.upload(filePath, file, {
					cacheControl: '3600',
					upsert: false
				});

			if (error) throw error;

			// Get the public URL
			const { data: { publicUrl } } = supabase.storage
				.from('files')
				.getPublicUrl(data.path);

			// Create database record
			const { data: fileData, error: dbError } = await supabase
				.from('files')
				.insert({
					name: file.name,
					url: publicUrl,
					folder_id: currentFolder.id,
					user_id: currentUser.id,
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (dbError) throw dbError;

			// Update progress to 100%
			setUploadingFiles(prev => 
				prev.map(uploadFile => 
					uploadFile.name === file.name 
						? { ...uploadFile, progress: 100 }
						: uploadFile
				)
			);

			// Clear the file input
			if (uploadFile.current) {
				uploadFile.current.value = '';
			}

			// Remove from uploading files after animation
			setTimeout(() => {
				setUploadingFiles(prev => 
					prev.filter(uploadFile => uploadFile.name !== file.name)
				);
			}, 2000);

		} catch (error) {
			console.error("Error uploading file:", error);
			setUploadingFiles(prev => 
				prev.filter(uploadFile => uploadFile.name !== file.name)
			);
		}
	}

	return (
		<>
			<div data-tip="Upload file" className="tooltip tooltip-bottom">
				<label className="btn btn-circle btn-sm bg-primary hover:bg-primary/90 text-white border-none shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all">
					<input
						type="file"
						onChange={handleUpload}
						hidden
						accept="*/*"
						ref={uploadFile}
					/>
					<svg
						className="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
						/>
					</svg>
				</label>
			</div>

			{/* Upload Progress */}
			{uploadingFiles.length > 0 && (
				<div className="fixed bottom-4 right-4 z-50">
					<div className="bg-base-100 rounded-lg shadow-xl border p-4 min-w-[300px] max-w-md">
						<h3 className="font-medium mb-3">Uploading Files</h3>
						<div className="space-y-3">
							{uploadingFiles.map(file => (
								<div key={file.id} className="space-y-2">
									<div className="flex justify-between text-sm">
										<p className="truncate max-w-[200px]">{file.name}</p>
										<span>{file.progress}%</span>
									</div>
									<div className="w-full bg-base-200 rounded-full h-2">
										<div 
											className="bg-primary h-2 rounded-full transition-all duration-300"
											style={{ width: `${file.progress}%` }}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default AddFileBtn;
