export async function handleChooseImage (files) {
    const pickemImages = document.getElementById("pickemImages");
    const pickemLabel = document.getElementById("pickemLabel");
    const pickemInput = document.getElementById("pickemInput");

    if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = document.createElement("img");
            image.onclick = function() {
                pickemInput.click();
            };
            image.className = "scan__image";
            image.src = e.target.result;

            pickemImages.innerHTML = "";
            pickemImages.appendChild(image);
        };

        const file = files[0];
        reader.readAsDataURL(file);
        pickemLabel.textContent = file.name;
    } else {
        pickemImages.innerHTML = "";
        pickemLabel.textContent = "Choose file";
    }
}
