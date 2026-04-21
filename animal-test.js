const URL_MODEL = "https://teachablemachine.withgoogle.com/models/zuBj0AxO0/";
let model, labelContainer, maxPredictions;

async function loadModel() {
    const modelURL = URL_MODEL + "model.json";
    const metadataURL = URL_MODEL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement("div");
        div.className = "prediction-bar";
        labelContainer.appendChild(div);
    }
}

async function predict() {
    const image = document.getElementById('face-image');
    const prediction = await model.predict(image);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        labelContainer.childNodes[i].innerHTML = `
            <div class="label-wrapper">
                <span>${className}</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${probability}%"></div>
                </div>
                <span>${probability}%</span>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('image-upload');
    const faceImage = document.getElementById('face-image');
    const previewContainer = document.getElementById('image-preview-container');

    if (imageUpload) {
        imageUpload.addEventListener('change', async (e) => {
            if (!model) await loadModel();
            
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    faceImage.src = event.target.result;
                    previewContainer.style.display = 'block';
                    faceImage.onload = async () => {
                        await predict();
                    };
                };
                reader.readAsDataURL(file);
            }
        });
    }

    loadModel();
});
