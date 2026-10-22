import { useState, useRef } from "react";
import Detailpopup from "./Detailpopup";

const url = "http://localhost:3000";

const File = ({ files, dirId, getFile }: { files: string[], dirId: string, getFile: any }) => {

    const [showDetail, setshowDetail] = useState({});
    const [showDetailPopup, setshowDetailPopup] = useState(false);
    const [newFileName, setNewFileName] = useState<string>("");
    const [showRenamePopup, setShowRenamePopup] = useState(false);
    const [renameFileId, setRenameFileId] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);

    const popupRef = useRef<HTMLDivElement>(null);

    const handleUpload = async (e: any) => {
        const file = e.target.files[0];
        console.log(file.size)
        if (!file) return;

        // upload to aws 

        async function uploadInitate() {
            const response = await fetch(`${url}/file/initiateUpload`, {
                method: "POST",
                body: JSON.stringify({
                    fileName: file.name,
                    fileSize: file.size,
                    contentType: file.type,
                    parentDirId: dirId || ""
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            return await response.json();

        }

        const { uploadSignedUrl, id } = await uploadInitate();




        setUploading(true);
        try {
            const response = await fetch(uploadSignedUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                },
                body: file,
            });
            await getFile();
            console.log({ file: response });
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        try {
            const response = await fetch(`${url}/file/${id}`, {
                method: "DELETE",
                credentials: 'include'
            });
            const data = await response.text();
            console.log(data);
            await getFile();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleRename = async () => {
        try {
            const response = await fetch(`${url}/file/${renameFileId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newFileName }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to rename file');
            }

            const data = await response.json();
            console.log(data);

            closePopup();
            await getFile();

        } catch (error) {
            console.error('Error renaming file:', error);
        }
    };

    const closePopup = () => {
        setShowRenamePopup(false);
        setNewFileName("");
        setRenameFileId("");
    };

    return (
        <div>
            {/* Upload Section */}
            <div className="mb-6 ">
                <label
                    htmlFor="file-upload"
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${uploading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                        }`}
                >
                    {uploading ? '⏳ Uploading...' : '📤 Upload File'}
                </label>

                <input
                    id="file-upload"
                    type="file"
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                />
            </div>

            {/* Files Grid */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {files && files.length > 0 ? (
                    files.map((item: any, index) => (
                        <div
                            key={index}
                            className='group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md'
                        >
                            {/* File Info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📄</span>
                                    <div>
                                        <p className="font-medium text-gray-800 truncate max-w-[150px]">
                                            {item.fileName}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {item.fileSize ? `${(item.fileSize / 1024).toFixed(1)} KB` : 'File'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
                                <a
                                    href={`${url}/file/${item._id}?action=open`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 rounded-lg bg-blue-50 px-3 py-1.5 text-center text-sm text-blue-600 transition-all hover:bg-blue-100"
                                >
                                    👁️ Open
                                </a>
                                <a
                                    href={`${url}/file/${item._id}?action=download`}
                                    className="flex-1 rounded-lg bg-green-50 px-3 py-1.5 text-center text-sm text-green-600 transition-all hover:bg-green-100"
                                >
                                    ⬇️ Download
                                </a>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => {
                                        setNewFileName(item.fileName);
                                        setRenameFileId(item._id);
                                        setShowRenamePopup(true);
                                    }}
                                    className="flex-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-all hover:bg-gray-200"
                                >
                                    ✏️ Rename
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="flex-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 transition-all hover:bg-red-100"
                                >
                                    🗑️ Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setshowDetail(item)
                                        setshowDetailPopup((pre) => !pre)
                                    }}
                                    className="flex-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm text-blue-600 transition-all hover:bg-red-100"
                                >
                                    Details
                                </button>
                            </div>


                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <span className="text-6xl mb-4">📭</span>
                        <p className="text-gray-500 text-lg">No files to show</p>
                        <p className="text-gray-400 text-sm">Upload a file to get started</p>
                    </div>
                )}
            </div>

            {/* Rename Popup */}
            {
                showDetailPopup && <Detailpopup item={showDetail} setshowDetailPopup={setshowDetailPopup} />
            }
            {showRenamePopup && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all"
                    onClick={closePopup}
                >
                    <div
                        ref={popupRef}
                        className="w-96 rounded-2xl bg-white p-8 shadow-2xl transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">✏️</span>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Rename File
                                </h2>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Enter a new name for your file
                            </p>
                        </div>

                        <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            placeholder="Enter new file name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleRename();
                                }
                                if (e.key === 'Escape') {
                                    closePopup();
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
                                onClick={handleRename}
                                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                            >
                                Rename
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default File;