import { useReducer, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export const ROOT_FOLDER = { name: "Root", id: null, path: [] };

export interface IFolder {
	id: string | null;
	name: string;
	path: string[];
}

const ACTIONS = {
	SELECT_FOLDER: "select-folder",
	UPDATE_FOLDER: "update-folder",
	SET_CHILD_FOLDERS: "set-child-folders",
	SET_CHILD_FILES: "set-child-files",
};

export function useFolder(folderId = null, folder = null) {
	const [state, dispatch] = useReducer(reducer, {
		folderId,
		folder,
		childFolders: [],
		childFiles: [],
	});
	const { currentUser } = useAuth();

	const refreshFiles = useCallback(async () => {
		if (!currentUser) return;

		try {
			// Fetch files
			const { data: files, error: filesError } = await supabase
				.from('files')
				.select('*')
				.eq('user_id', currentUser.id)
				.order('name');

			if (folderId === null) {
				files = files.filter(file => file.folder_id === null);
			} else {
				files = files.filter(file => file.folder_id === folderId);
			}

			if (filesError) throw filesError;

			dispatch({
				type: ACTIONS.SET_CHILD_FILES,
				payload: { childFiles: files || [] }
			});

			// Fetch folders
			const { data: folders, error: foldersError } = await supabase
				.from('folders')
				.select('*')
				.eq('parent_id', folderId || null)
				.eq('user_id', currentUser.id)
				.order('name');

			if (foldersError) throw foldersError;

			dispatch({
				type: ACTIONS.SET_CHILD_FOLDERS,
				payload: { childFolders: folders || [] }
			});

		} catch (error) {
			console.error('Error refreshing files:', error);
		}
	}, [currentUser, folderId]);

	// Initial fetch
	useEffect(() => {
		refreshFiles();
	}, [refreshFiles]);

	return { ...state, refreshFiles };
}

function reducer(state: any, { type, payload }: any) {
	switch (type) {
		case ACTIONS.SELECT_FOLDER:
			return {
				...state,
				folderId: payload.folderId,
				folder: payload.folder,
			};
		case ACTIONS.UPDATE_FOLDER:
			return {
				...state,
				folder: payload.folder,
			};
		case ACTIONS.SET_CHILD_FOLDERS:
			return {
				...state,
				childFolders: payload.childFolders,
			};
		case ACTIONS.SET_CHILD_FILES:
			return {
				...state,
				childFiles: payload.childFiles,
			};
		default:
			return state;
	}
}
