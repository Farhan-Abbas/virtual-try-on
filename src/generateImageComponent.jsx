/* eslint-disable react/prop-types */
import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client@latest/dist/index.js";

// Define the generateImage function in the global scope
async function generateImage(bodyImagePlaceholder, garmentImg) {
	try {
		const response_0 = await fetch(garmentImg);
		const garmentImgBlob = await response_0.blob();
	
		// Initialize the client with the Hugging Face Space
		const app = await Client.connect("yisol/IDM-VTON");

		// Make a prediction request to the Space
		const result = await app.predict("/tryon", [
			{
				background: await file(
					bodyImagePlaceholder
				),
				layers: [],
				composite: null,
			}, // Imageeditor component
			garmentImgBlob,
			"", // String in 'parameter_17' Textbox component
			true, // Boolean in 'Yes' Checkbox component
			true, // Boolean in 'Yes' Checkbox component
			30, // Number in 'Denoising Steps' Number component (updated to meet minimum value constraint)
			42, // Number in 'Seed' Number component (updated to meet minimum value constraint)
		]);

		// Log the result
		console.log("success");
		console.log(result.data);
		return ["success", result.data[0]["url"]];
	} catch (error) {
		// Log detailed error information
		console.error("Prediction request failed:", error);
		return ["failure", error];
	}
}

// Define the file function
async function file(url) {
	const response = await fetch(url);
	return response.blob();
}

export function generateImageComponent(bodyImagePlaceholder, garmentImg) {
    let response = "";
    const handleGenerateImage = async () => {
		let generatedImgDiv = document.getElementsByClassName("generated-image-container")[0];
		generatedImgDiv.style.display = "none";
		let errorMsg = document.getElementsByClassName("error-msg")[0];
		errorMsg.style.display = "none";

		let loader = document.getElementsByClassName("loading-container")[0];

		loader.style.display = "flex";
		window.scrollTo(0, document.body.scrollHeight);

		response = await generateImage(bodyImagePlaceholder, garmentImg);
		// response = ["success", "https://www.w3schools.com/w3images/lights.jpg"];
		console.log("finished", response);

		loader.style.display = "none";

		if (response[0] === "success") {
			let resultImg = document.getElementById("resultImage");
			resultImg.src = response[1];
			generatedImgDiv.style.display = "block";
			window.scrollTo(0, document.body.scrollHeight);
		}
		else {
			errorMsg.style.display = "block";
			errorMsg.innerHTML = "Error: " + response[1]["message"];
			window.scrollTo(0, document.body.scrollHeight);
		}
    };
    handleGenerateImage();
}
