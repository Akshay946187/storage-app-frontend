import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import File from './File.tsx';

const Dir = () => {
  const [rootDir, setrootDir] = useState<any>();
  const [file, setFile] = useState<string[]>([]);
  const [dirName, setDirName] = useState<string>('');
  const [showFolderPopup, setShowFolderPopup] = useState(false);
 
  const [popupType, setPopupType] = useState<"folder" | "rename" | null>(null);
  const [folderParentId, setFolderParentId] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [dirList, setDirList] = useState<any>([]);

  const popupRef = useRef<HTMLDivElement>(null);
  const url = "http://localhost:3000";
  const { dirId } = useParams();
  const navigate = useNavigate();

  const getFile = async () => {
    try {
      const response = await fetch(`${url}/dir/${dirId ? dirId : ''}`, {
        credentials: 'include'
      });
      const data = await response.json();
      console.log({ data });
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      setrootDir(data.folderData);
      setDirList(data.directories);
      setFile(data.fiels);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    getFile();
  }, [dirId]);

  const closePopup = () => {
    setShowFolderPopup(false);
   
    setDirName('');
    setPopupType(null);
    setFolderParentId('');
  };

  const handleDirDelete = async (id: string) => {
    const response = await fetch(`${url}/dir/${id}`, {
      method: "DELETE",
      credentials: 'include'
    });
    getFile();
    const data = await response.text();
    console.log(data);
  };

  const handleDirRename = async () => {
    try {
      const response = await fetch(`${url}/dir/${folderParentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newDirName: dirName,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to rename folder");
      }

      const data = await response.json();
      console.log(data);
      closePopup();
      getFile();
    } catch (error) {
      console.error("Error renaming folder:", error);
    }
  };

  const addFolder = async (e: any) => {
    e.preventDefault();
    console.log(dirName);
    const dirurl = `${url}/dir/${folderParentId || dirId || ''}`;
    console.log(dirurl);
    const response = await fetch(dirurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dirName }),
      credentials: 'include'
    });
    getFile();
    closePopup();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📁</span>
            <div>
              <h4 className="text-2xl font-bold text-gray-800">
                {rootDir?.dirName || 'Root Directory'}
              </h4>
              <p className="text-sm text-gray-500">
                {dirList?.length || 0} folders • {file?.length || 0} files
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(menuOpen === rootDir?._id ? null : rootDir?._id)}
              className="rounded-full p-2 text-xl text-gray-500 transition-all hover:bg-gray-100 hover:shadow-md"
            >
              ⋮
            </button>

            {menuOpen === rootDir?._id && (
              <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                <button
                  onClick={() => {
                    setMenuOpen(null);
                    setShowFolderPopup(true);
                    setPopupType("folder");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-blue-50 hover:text-blue-600"
                >
                  <span>📁</span> Add Folder
                </button>
               
              </div>
            )}
          </div>
        </div>
      </div>

    

      {/* Folder Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dirList?.map((dir: any) => {
          return (
            <div
              key={dir._id}
              className="group relative transform rounded-2xl border border-gray-200 bg-white p-5 shadow-md transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📁</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-blue-600">
                      {dir?.dirName}
                    </h4>
                    <p className="text-xs text-gray-400">Folder</p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === dir._id ? null : dir._id)}
                    className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700"
                  >
                    ⋮
                  </button>

                  {menuOpen === dir._id && (
                    <div className="absolute right-0 top-8 z-20 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                      <button
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => {
                          setFolderParentId(dir._id);
                          setMenuOpen(null);
                          setShowFolderPopup(true);
                          setPopupType("folder");
                        }}
                      >
                        <span>📁</span> New Folder
                      </button>

                      <Link
                        to={`/dir/${dir._id}`}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setMenuOpen(null)}
                      >
                        <span>🔗</span> Open
                      </Link>

                      <button
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-yellow-50 hover:text-yellow-600"
                        onClick={() => {
                          setFolderParentId(dir._id);
                          setMenuOpen(null);
                          setShowFolderPopup(true);
                          setDirName(dir.dirName);
                          setPopupType("rename");
                        }}
                      >
                        <span>✏️</span> Rename
                      </button>

                      <button
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        onClick={() => {
                          handleDirDelete(dir._id);
                          setMenuOpen(null);
                        }}
                      >
                        <span>🗑️</span> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Folder Popup (Create/Rename) */}
      {showFolderPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={closePopup}
        >
          <div
            ref={popupRef}
            className="w-96 rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {popupType === "folder" ? "Create New Folder" : "Rename Folder"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {popupType === "folder"
                  ? "Enter a name for your new folder"
                  : "Enter a new name for this folder"}
              </p>
            </div>

            <input
              type="text"
              placeholder={
                popupType === "folder"
                  ? "Enter folder name..."
                  : "Enter new folder name..."
              }
              value={dirName}
              onChange={(e) => setDirName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (popupType === "folder") {
                    addFolder(e);
                  } else {
                    handleDirRename();
                  }
                }
              }}
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={closePopup}
                className="flex-1 rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  if (popupType === "folder") {
                    addFolder(e);
                  } else {
                    handleDirRename();
                  }
                }}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
              >
                {popupType === "folder" ? "Create" : "Rename"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Component */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
        <File files={file} dirId={dirId || ''} getFile={getFile} />
      </div>
    </div>
  );
};

export default Dir;