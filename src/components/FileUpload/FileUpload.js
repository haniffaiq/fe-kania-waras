import React, { useState } from 'react';
import BASE_URL from '../../utils/apiConfig';
const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    // const [responseData, setResponseData] = useState(null);
    const [downloadReady, setDownloadReady] = useState(false);
    const [downloadLink, setDownloadLink] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleDownload = () => {
        if (downloadLink) {
            const selectedBranch = document.getElementById('branchSelect').value;
            // Dapatkan tanggal, bulan, dan tahun saat ini
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Perlu ditambahkan 1 karena bulan dimulai dari 0
            const year = currentDate.getFullYear();

            // Format tanggal, bulan, dan tahun ke dalam string (misal: "2023-09-28")
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            // Gabungkan selectedBranch dan tanggal menjadi nama file
            const fileName = `Order_Obat_${selectedBranch}_${formattedDate}.xlsx`;
            
            const a = document.createElement('a');
            a.href = downloadLink;
            a.download = fileName; // Nama file yang akan diunduh
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            const selectedBranch = document.getElementById('branchSelect').value;
            setUploading(true);
            setDownloadReady(false);

            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);

            reader.onload = () => {
                const fileData = reader.result.split(',')[1];
                const requestBody = {
                    cabang: selectedBranch, // Menggunakan cabang yang dipilih
                    file: fileData
                };

                const specificEndpoint = `${BASE_URL}/api/data`;

                fetch(specificEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);

                        const blob = b64toBlob(data.data);
                        const blobUrl = URL.createObjectURL(blob);

                        // setResponseData(data);
                        setDownloadLink(blobUrl);
                        setDownloadReady(true);
                        setUploading(false);
                    })
                    .catch(error => {
                        console.error('Error uploading file:', error);
                        setUploading(false);
                    });
            };
        }
    };

    // Fungsi untuk mengonversi base64 ke blob
    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    };

    // const renderResponseData = () => {
    //     if (responseData) {
    //         return (
    //             <div>
    //                 <p>Data Received:</p>
    //                 <pre>{JSON.stringify(responseData, null, 2)}</pre>
    //             </div>
    //         );
    //     }
    //     return null;
    // };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
        // console.log(file)
    };
    console.log(isDragging);

    return (
        <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="mb-4 text-lg font-semibold">File Upload LapStok</div>

            <div className=''>
                <label htmlFor="branchSelect" className="text-gray-700 block text-center">Pilih Cabang</label>
                <select
                    id="branchSelect"
                    className="block mx-auto mt-1 border rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 w-30 py-2 px-10 hover:bg-blue-200"
                >
                    <option value="KWM">KWM</option>
                    <option value="KWB">KWB</option>
                    <option value="MUT">MUT</option>
                    <option value="MUS">MUS</option>
                    <option value="KWU">KWU</option>
                </select>
            </div>

            <div
                className={`border-dashed border-2 border-gray-700 p-20 text-center ${isDragOver ? 'bg-blue-200 border-blue-500' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragLeave}
            >
                {selectedFile ? (
                    <div>
                        <p className="mb-2">{selectedFile.name}</p>
                        {/* <p className="text-gray-500">{selectedFile.type}</p> */}
                        <p className="text-gray-500">
                            {selectedFile.size / 1024} KB
                        </p>
                        {uploading ? (
                            <p className="text-blue-500">Uploading...</p>
                        ) : (
                            downloadReady ? (
                                <button
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2`}
                                    onClick={handleDownload}
                                >
                                    Download
                                </button>
                            ) : (
                                <button
                                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2`}
                                    onClick={handleUpload}
                                >
                                    Upload
                                </button>
                            )
                        )}
                    </div>
                ) : (
                    <div>
                        <label
                            htmlFor="fileInput"
                            className={`cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isDragOver ? 'bg-blue-700' : ''}`}
                        >
                            {isDragOver ? 'Drop File Here' : 'Choose or Drag & Drop File'}
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".xlsx, .xls, .csv" // Hanya menerima tipe file yang diizinkan
                        />

                        <p className="text-gray-500 mt-2">
                            (Drag and drop a file or click to select one)
                        </p>
                        {isDragOver && (
                            <button
                                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2`}
                                onClick={handleUpload}
                            >
                                Upload
                            </button>
                        )}
                    </div>
                )}
            </div>



            {/* {renderResponseData()} Menampilkan konten respons */}
        </div>
    );
};

export default FileUpload;
