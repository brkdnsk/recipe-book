import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [recipes, setRecipes] = useState([]);
	const [form, setForm] = useState({
		title: "",
		description: "",
		category: "",
		prepTimeMinutes: "",
	});

	// Tarifler Backend'den Çekilir
	const fetchRecipes = async () => {
		try {
			const response = await axios.get("http://localhost:8080/api/recipes");
			setRecipes(response.data);
		} catch (error) {
			console.error("Tarifler yüklenirken hata oluştu:", error);
		}
	};

	useEffect(() => {
		fetchRecipes();
	}, []);

	// Form Gönderildiğinde Yeni Tarif Eklenir
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("http://localhost:8080/api/recipes", {
				...form,
				prepTimeMinutes: Number(form.prepTimeMinutes),
			});
			setForm({
				title: "",
				description: "",
				category: "",
				prepTimeMinutes: "",
			});
			fetchRecipes(); // Listeyi güncelle
		} catch (error) {
			console.error("Tarif eklenirken hata oluştu:", error);
		}
	};

	return (
		<div
			style={{
				maxWidth: "800px",
				margin: "40px auto",
				fontFamily: "sans-serif",
				padding: "20px",
			}}
		>
			<h1>🍳 Tarif Defterim (Recipe App)</h1>

			{/* Tarif Ekleme Formu */}
			<form
				onSubmit={handleSubmit}
				style={{
					background: "#f9f9f9",
					padding: "20px",
					borderRadius: "8px",
					marginBottom: "30px",
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
				}}
			>
				<h3>Yeni Tarif Ekle</h3>
				<div style={{ marginBottom: "10px" }}>
					<input
						type="text"
						placeholder="Tarif Adı (örn. Menemen)"
						value={form.title}
						onChange={(e) => setForm({ ...form, title: e.target.value })}
						required
						style={{
							width: "100%",
							padding: "8px",
							boxSizing: "border-box",
						}}
					/>
				</div>
				<div style={{ marginBottom: "10px" }}>
					<textarea
						placeholder="Açıklama"
						value={form.description}
						onChange={(e) =>
							setForm({ ...form, description: e.target.value })
						}
						style={{
							width: "100%",
							padding: "8px",
							boxSizing: "border-box",
						}}
					/>
				</div>
				<div style={{ marginBottom: "10px" }}>
					<input
						type="text"
						placeholder="Kategori (örn. Kahvaltı)"
						value={form.category}
						onChange={(e) =>
							setForm({ ...form, category: e.target.value })
						}
						style={{
							width: "100%",
							padding: "8px",
							boxSizing: "border-box",
						}}
					/>
				</div>
				<div style={{ marginBottom: "10px" }}>
					<input
						type="number"
						placeholder="Hazırlık Süresi (dakika)"
						value={form.prepTimeMinutes}
						onChange={(e) =>
							setForm({ ...form, prepTimeMinutes: e.target.value })
						}
						style={{
							width: "100%",
							padding: "8px",
							boxSizing: "border-box",
						}}
					/>
				</div>
				<button
					type="submit"
					style={{
						background: "#4CAF50",
						color: "white",
						padding: "10px 15px",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
				>
					Tarif Ekle
				</button>
			</form>

			{/* Tarif Listesi */}
			<h2>Kayıtlı Tarifler</h2>
			{recipes.length === 0 ? (
				<p>Henüz tarif eklenmemiş.</p>
			) : (
				<ul style={{ listStyle: "none", padding: 0 }}>
					{recipes.map((recipe) => (
						<li
							key={recipe.id}
							style={{
								background: "#fff",
								border: "1px solid #ddd",
								padding: "15px",
								borderRadius: "8px",
								marginBottom: "15px",
								boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
							}}
						>
							<h3 style={{ margin: "0 0 5px 0", color: "#333" }}>
								{recipe.title}
							</h3>
							<p style={{ margin: "0 0 10px 0", color: "#666" }}>
								{recipe.description}
							</p>
							<small
								style={{
									background: "#e0e0e0",
									padding: "3px 8px",
									borderRadius: "4px",
									marginRight: "10px",
								}}
							>
								Kategori: {recipe.category}
							</small>
							<small
								style={{
									background: "#e0e0e0",
									padding: "3px 8px",
									borderRadius: "4px",
								}}
							>
								Süre: {recipe.prepTimeMinutes} dk
							</small>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default App;
