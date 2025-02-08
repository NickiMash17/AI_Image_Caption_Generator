document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('previewImage').style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('generateCaption').addEventListener('click', async function() {
    const imageFile = document.getElementById('imageInput').files[0];
    if (!imageFile) {
        alert("Please upload an image first.");
        return;
    }

    // Convert image to Base64
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = async function() {
        const base64Image = reader.result.split(',')[1];

        const apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your OpenAI API key
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: "Generate a detailed caption for this image.",
                image: base64Image,
                model: "gpt-4-vision"
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            document.getElementById('captionText').innerText = data.choices[0].text;
        } else {
            document.getElementById('captionText').innerText = "Failed to generate caption.";
        }
    };
});
