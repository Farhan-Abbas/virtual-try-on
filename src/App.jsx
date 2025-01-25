import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "bulma/css/bulma.min.css";
import "./App.css";
import { generateImageComponent } from "./generateImageComponent.jsx";
import bodyImagePlaceholder from "./assets/miler-breathable-heathered-jersey-t-shirt.jpg";
import garmentImagePlaceholder from "./assets/81iB1a1+mWL._AC_UY1000_.jpg";

// main app component
function App() {
	const [garmentImage, setGarmentImage] = useState(garmentImagePlaceholder);
	const [bodyImage, setBodyImage] = useState(bodyImagePlaceholder);
	const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

	useEffect(() => {
		const userAgent = navigator.userAgent || window.opera;
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
			setIsMobileOrTablet(true);
		}
	}, []);

	useEffect(() => {
		if (isMobileOrTablet) {
			Swal.fire({
				title: "Warning",
				text: "This website is currently for desktop use only. Please use a desktop device to access this website.",
				icon: "warning",
				confirmButtonText: "OK",
			});
		}
	}, [isMobileOrTablet]);

	useEffect(() => {
		// display the selected image of the user body in the browser.
		const fileInput = document.getElementById("fileInput");
		const bodyImage = document.getElementById("bodyImage");

		// Handle file input change event
		fileInput.addEventListener("change", (event) => {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					bodyImage.src = e.target.result;
					setBodyImage(e.target.result);
				};
				reader.readAsDataURL(file);
			}
		});

		const pasteArea = document.getElementById("pasteArea");
		if (pasteArea) {
			pasteArea.onpaste = function (event) {
				// use event.clipboardData for newer chrome versions
				var items = (event.clipboardData || event.originalEvent.clipboardData)
					.items;
				// find pasted image among pasted items
				var blob = null;
				for (var i = 0; i < items.length; i++) {
					if (items[i].type.indexOf("image") === 0) {
						blob = items[i].getAsFile();
					}
				}
				// load image if there is a pasted image
				if (blob !== null) {
					var reader = new FileReader();
					reader.onload = function (event) {
						setGarmentImage(event.target.result);
						document.getElementById("pastedImage").src = event.target.result;
					};
					reader.readAsDataURL(blob);
				}
			};
		}
	});

	return (
		<div
			className="container is-fluid"
			style={{ padding: "20px", backgroundColor: "white" }}
		>
			<div className="content has-text-centered">
				<h1 className="title is-1 has-text-primary">
					<u>Virtual-Try-On</u>
				</h1>
				<p className="subtitle is-5 selectImgYourself">
					Select an Image of Yourself Below
				</p>
				<div className="file is-centered mb-4">
					<label className="file-label">
						<input
							className="file-input"
							type="file"
							id="fileInput"
							accept="image/*"
						/>
						<span className="file-cta">
							<span className="file-label">Choose a file…</span>
						</span>
					</label>
				</div>
				<p className="subtitle is-5">Your Selected Image</p>
				<figure className="image">
					<img id="bodyImage" alt="User Body" src={bodyImage} />
				</figure>
				<p className="subtitle is-5">Paste a Photo Of a Garment Below</p>
				<div className="field">
					<div className="control">
						<textarea
							className="textarea"
							id="pasteArea"
							placeholder="Paste The Image Of Your Garment Here"
						></textarea>
					</div>
				</div>
				<p className="subtitle is-5">Your Selected Garment</p>
				<figure className="image">
					<img
						id="pastedImage"
						alt="Pasted Garment"
						src={garmentImagePlaceholder}
					/>
				</figure>
				<div className="button-container">
					<button
						className="button is-primary is-fullwidth"
						onClick={() => generateImageComponent(bodyImage, garmentImage)}
					>
						Try It On Yourself!
					</button>
				</div>
				<div className="loading-container" style={{ display: "none" }}>
					<div className="loading"></div>
					<p className="subtitle is-5 mt-4">Loading...</p>
				</div>
				<p
					className="error-msg subtitle is-5 mt-4"
					style={{ display: "none" }}
				></p>
				<div className="generated-image-container" style={{ display: "none" }}>
					<p className="subtitle is-5 mt-4">
						Here&rsquo;s How You Would Look In This Garment
					</p>
					<figure className="image">
						<img id="resultImage" alt="Generated Image" src="" />
					</figure>
				</div>
			</div>
		</div>
	);
}

export default App;
