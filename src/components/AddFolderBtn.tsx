import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import CreateFolderIcon from "./icons/CreateFolderIcon";

// TS INTERFACES
import { IFolder } from "src/hooks/useFolder";

interface Props {
	currentFolder: IFolder;
}

const AddFolderBtn: React.FC<Props> = ({ currentFolder }) => {
	const [name, setName] = useState("");
	const { currentUser } = useAuth();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!currentUser?.id) {
			console.error("No user logged in");
			return;
		}

		const folderName = name.trim();
		if (folderName === "") return;

		try {
			const { data, error } = await supabase
				.from('folders')
				.insert({
					name: folderName,
					parent_id: currentFolder.id,
					user_id: currentUser.id,
					path: currentFolder.path.length > 0 
						? [...currentFolder.path, currentFolder.name] 
						: [],
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) {
				console.error("Database error:", error);
				throw error;
			}

			console.log("Folder created:", data);
			setName("");

			// Close the modal
			const modalCheckbox = document.getElementById('create-folder') as HTMLInputElement;
			if (modalCheckbox) {
				modalCheckbox.checked = false;
			}

		} catch (error) {
			console.error("Error creating folder:", error);
		}
	}

	return (
		<>
			<div data-tip="Create folder" className="tooltip tooltip-bottom">
				<label
					htmlFor="create-folder"
					className="btn btn-circle btn-sm bg-secondary hover:bg-secondary/90 text-white border-none shadow-lg hover:shadow-xl hover:shadow-secondary/20 transition-all"
				>
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
							d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
						/>
					</svg>
				</label>
			</div>

			<input type="checkbox" id="create-folder" className="modal-toggle" />
			<div className="modal modal-bottom sm:modal-middle">
				<div className="modal-box bg-base-100">
					<h3 className="text-lg font-bold mb-4">Create New Folder</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							type="text"
							value={name}
							onChange={e => setName(e.target.value)}
							className="input input-bordered w-full"
							placeholder="Folder name"
							autoFocus
						/>
						<div className="modal-action">
							<label htmlFor="create-folder" className="btn btn-ghost">
								Cancel
							</label>
							<button type="submit" className="btn btn-primary">
								Create
							</button>
						</div>
					</form>
				</div>
				<label className="modal-backdrop" htmlFor="create-folder">Close</label>
			</div>
		</>
	);
};

export default AddFolderBtn;
