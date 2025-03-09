import { useReducer, useEffect } from "react";
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

	useEffect(() => {
		dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } });
	}, [folderId, folder]);

	useEffect(() => {
		if (folderId == null) {
			return dispatch({
				type: ACTIONS.UPDATE_FOLDER,
				payload: { folder: ROOT_FOLDER }
			});
		}

		async function fetchFolder() {
			try {
				const { data, error } = await supabase
					.from('folders')
					.select()
					.eq('id', folderId)
					.single();

				if (error) throw error;

				dispatch({
					type: ACTIONS.UPDATE_FOLDER,
					payload: { folder: data }
				});
			} catch (error) {
				console.error("Error fetching folder:", error);
				dispatch({
					type: ACTIONS.UPDATE_FOLDER,
					payload: { folder: ROOT_FOLDER }
				});
			}
		}

		fetchFolder();
	}, [folderId]);

	useEffect(() => {
		if (!currentUser?.id) return;

		async function fetchChildFolders() {
			try {
				let query = supabase
					.from('folders')
					.select()
					.eq('user_id', currentUser.id)
					.order('name');

				if (folderId === null) {
					query = query.is('parent_id', null);
				} else {
					query = query.eq('parent_id', folderId);
				}

				const { data, error } = await query;

				if (error) throw error;

				dispatch({
					type: ACTIONS.SET_CHILD_FOLDERS,
					payload: { childFolders: data || [] }
				});
			} catch (error) {
				console.error("Error fetching child folders:", error);
			}
		}

		fetchChildFolders();
	}, [folderId, currentUser]);

	useEffect(() => {
		if (!currentUser?.id) return;

		async function fetchChildFiles() {
			try {
				let query = supabase
					.from('files')
					.select()
					.eq('user_id', currentUser.id)
					.order('name');

				if (folderId === null) {
					query = query.is('folder_id', null);
				} else {
					query = query.eq('folder_id', folderId);
				}

				const { data, error } = await query;

				if (error) throw error;

				dispatch({
					type: ACTIONS.SET_CHILD_FILES,
					payload: { childFiles: data || [] }
				});
			} catch (error) {
				console.error("Error fetching child files:", error);
			}
		}

		fetchChildFiles();
	}, [folderId, currentUser]);

	return state;
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
