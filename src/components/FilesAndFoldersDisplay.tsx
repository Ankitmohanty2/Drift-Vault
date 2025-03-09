// COMPONENTS
import AddFolderBtn from "./AddFolderBtn";
import Folder from "./Folder";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import AddFileBtn from "./AddFileBtn";
import File from "./File";

// CUSTOM HOOKS
import { useFolder } from "@/hooks/useFolder";
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// TS INTERFACES
interface Props {
	folderId: string | null;
}

const FilesAndFoldersDisplay: React.FC<Props> = ({ folderId }) => {
	const { folder, childFolders, childFiles, refreshFiles } = useFolder(folderId);

	// Subscribe to real-time changes
	useEffect(() => {
		const filesChannel = supabase
			.channel('files-channel')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'files',
				},
				() => {
					refreshFiles();
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(filesChannel);
		};
	}, [refreshFiles]);

	const handleFileDelete = () => {
		refreshFiles();
	};

	return (
		<div className="py-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold">
					{folder?.name || "Root"}
				</h2>
				<div className="flex space-x-2">
					<AddFileBtn currentFolder={folder} />
					<AddFolderBtn currentFolder={folder} />
				</div>
			</div>

			{childFolders.length > 0 && (
				<div className="mb-8">
					<h3 className="text-lg font-semibold mb-3">Folders</h3>
					<div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{childFolders.map((childFolder) => (
							<Folder key={childFolder.id} folder={childFolder} />
						))}
					</div>
				</div>
			)}

			{childFiles.length > 0 && (
				<div>
					<h3 className="text-lg font-semibold mb-3">Files</h3>
					<div className="space-y-2">
						{childFiles.map((childFile) => (
							<File
								key={childFile.id}
								id={childFile.id}
								name={childFile.name}
								url={childFile.url}
								folderId={childFile.folder_id}
								path={folder?.path ? [...folder.path, folder.name] : []}
								onDelete={refreshFiles}
							/>
						))}
					</div>
				</div>
			)}

			{childFolders.length === 0 && childFiles.length === 0 && (
				<div className="text-center py-12">
					<div className="mb-4 text-base-content/50">
						<svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
								d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
						</svg>
					</div>
					<p className="text-base-content/60">This folder is empty</p>
				</div>
			)}
		</div>
	);
};

export default FilesAndFoldersDisplay;
