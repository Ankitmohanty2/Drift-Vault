import Link from "next/link";

// SVGs
import FolderIcon from "./icons/FolderIcon";

// TS INTERFACES
import { IFolder } from "src/hooks/useFolder"

interface Props {
    folder: IFolder
}

const Folder: React.FC<Props> = ({ folder }) => {
    return <Link href={`/folder/${folder.id}`}>
        <a className="block p-4 rounded-lg border bg-base-100 hover:bg-base-200 transition-colors group">
            <div className="flex items-center space-x-3">
                <div className="text-secondary group-hover:text-secondary/80 transition-colors">
                    <FolderIcon className="w-8 h-8" />
                </div>
                <p className="font-medium truncate">{folder.name}</p>
            </div>
        </a>
    </Link>
}

export default Folder
