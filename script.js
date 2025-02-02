function updateFileInputs() {
    const container = document.getElementById('fileInputs');
    container.innerHTML = '';
    const zipCount = Math.min(Math.max(parseInt(document.getElementById('zipCount').value), 2), 26);
    for (let i = 0; i < zipCount; i++) {
        const label = String.fromCharCode(65 + i);
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'zip' + label;
        input.accept = '.zip';
        container.appendChild(document.createTextNode(label + ': '));
        container.appendChild(input);
        container.appendChild(document.createElement('br'));
    }
}

async function mergeZipFiles() {
    const zipFiles = [];
    for (let i = 0; i < 26; i++) {
        const label = String.fromCharCode(65 + i);
        const fileInput = document.getElementById('zip' + label);
        if (fileInput && fileInput.files.length > 0) {
            zipFiles.push(fileInput.files[0]);
        }
    }
    if (zipFiles.length < 2) {
        alert("Please select at least two ZIP files.");
        return;
    }

    const mergedZip = new JSZip();
    for (const file of zipFiles) {
        const zip = new JSZip();
        await zip.loadAsync(file);
        zip.forEach((relativePath, file) => {
            if (!mergedZip.files[relativePath]) {
                mergedZip.file(relativePath, file.async('blob'));
            }
        });
    }

    const mergedBlob = await mergedZip.generateAsync({ type: "blob" });
    const link = document.getElementById('downloadLink');
    link.href = URL.createObjectURL(mergedBlob);
    link.download = "merged.zip";
    link.style.display = "block";
    link.innerText = "Download Merged ZIP";
}

updateFileInputs();
