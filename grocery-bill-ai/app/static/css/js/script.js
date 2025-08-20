// Show selected file name before upload
document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.querySelector("input[type='file']");
    const fileLabel = document.createElement("p");
    fileLabel.style.fontStyle = "italic";
    fileLabel.style.color = "#555";
    fileInput.insertAdjacentElement("afterend", fileLabel);

    fileInput.addEventListener("change", function() {
        if (fileInput.files.length > 0) {
            fileLabel.textContent = "Selected File: " + fileInput.files[0].name;
        } else {
            fileLabel.textContent = "";
        }
    });
});
