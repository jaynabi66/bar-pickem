export async function setUpPage() {
    const imageUrl = localStorage.getItem("imageUrl");
    const imageName = localStorage.getItem("imageName");
    if (imageUrl !== null && imageName !== null) {
        const pickemImages = document.getElementById("pickemImages");
        const pickemLabel = document.getElementById("pickemLabel");
        const pickemInput = document.getElementById("pickemInput");
        
        const image = document.createElement("img");
        image.onclick = function() {
            pickemInput.click();
        };
        image.className = "scan__image";
        image.src = imageUrl;

        pickemImages.innerHTML = "";
        pickemImages.appendChild(image);

        pickemLabel.innerHTML = imageName;
    }
}

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
            localStorage.setItem("imageUrl", e.target.result);

            pickemImages.innerHTML = "";
            pickemImages.appendChild(image);
        };

        const file = files[0];
        reader.readAsDataURL(file);
        pickemLabel.textContent = file.name;
        localStorage.setItem("imageName", file.name);
    } else {
        pickemImages.innerHTML = "";
        pickemLabel.textContent = "Choose file";

        localStorage.removeItem("imageUrl");
        localStorage.removeItem("imageName");
    }
}

export async function processImage () {
    const pickemImages = document.getElementById("pickemImages");
    const pickemLabel = document.getElementById("pickemLabel");

    if (pickemImages.length == 0) return;
    
    const imageUrl = pickemImages.firstChild.src;
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
        pickemImages.innerHTML = "Error! Image could not be loaded.";
        pickemLabel.textContent = "Choose file";
        return false;
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);

    const processResponse = await fetch("api/process", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: byteArray,
    });
    const body = await processResponse.json();
    localStorage.setItem("responseBody", JSON.stringify(body));
    return processResponse.ok;
}

export function clearLocalStorage() {
    localStorage.removeItem("imageUrl");
    localStorage.removeItem("imageName");
}
