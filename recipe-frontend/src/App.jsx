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
			fetchRecipes();
		} catch (error) {
			console.error("Tarif eklenirken hata oluştu:", error);
		}
	};

	return (
		<div className="app-container">
			<header className="app-header">
				<h1>🍳 Tarif Defterim</h1>
				<p>En lezzetli tariflerinizi keşfedin, kaydedin ve yönetin</p>
			</header>

			<div className="recipe-form-card">
				<h3>Yeni Tarif Ekle</h3>
				<form onSubmit={handleSubmit}>
					<div className="form-grid">
						<div className="form-group full-width">
							<input
								type="text"
								placeholder="Tarif Adı (örn. Fırında Soslu Tavuk)"
								value={form.title}
								onChange={(e) =>
									setForm({ ...form, title: e.target.value })
								}
								required
							/>
						</div>
						<div className="form-group full-width">
							<textarea
								placeholder="Tarif açıklaması, malzemeler ve hazırlık aşamaları..."
								value={form.description}
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
							/>
						</div>
						<div className="form-group">
							<input
								type="text"
								placeholder="Kategori (örn. Akşam Yemeği)"
								value={form.category}
								onChange={(e) =>
									setForm({ ...form, category: e.target.value })
								}
							/>
						</div>
						<div className="form-group">
							<input
								type="number"
								placeholder="Hazırlık Süresi (dakika)"
								value={form.prepTimeMinutes}
								onChange={(e) =>
									setForm({ ...form, prepTimeMinutes: e.target.value })
								}
							/>
						</div>
					</div>
					<button type="submit" className="submit-btn">
						Tarifi Kaydet
					</button>
				</form>
			</div>

			<section className="recipes-section">
				<h2>Kayıtlı Tarifler ({recipes.length})</h2>
				{recipes.length === 0 ? (
					<div className="empty-state">
						<p>
							📭 Henüz hiç tarif eklenmemiş. Yukarıdaki formu kullanarak
							ilk tarifini oluştur!
						</p>
					</div>
				) : (
					<div className="recipes-grid">
						{recipes.map((recipe) => (
							<div key={recipe.id} className="recipe-card">
								<div>
									<h3>{recipe.title}</h3>
									<p>{recipe.description}</p>
								</div>
								<div className="recipe-meta">
									{recipe.category && (
										<span className="badge category">
											{recipe.category}
										</span>
									)}
									{recipe.prepTimeMinutes && (
										<span className="badge time">
											⏱️ {recipe.prepTimeMinutes} dk
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}

export default App;
