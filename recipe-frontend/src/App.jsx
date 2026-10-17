import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [recipes, setRecipes] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
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

	const handleDelete = async (id) => {
		if (window.confirm("Bu tarifi silmek istediğinize emin misiniz?")) {
			try {
				await axios.delete(`http://localhost:8080/api/recipes/${id}`);
				fetchRecipes();
			} catch (error) {
				console.error("Tarif silinirken hata oluştu:", error);
			}
		}
	};

	// Benzersiz kategorileri dinamik olarak türetme
	const categories = [
		"",
		...new Set(recipes.map((r) => r.category).filter(Boolean)),
	];

	// Arama ve kategori filtreleme mantığı
	const filteredRecipes = recipes.filter((recipe) => {
		const matchesSearch =
			recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory =
			selectedCategory === "" || recipe.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="container py-5 animated-container">
			{/* Header */}
			<div className="text-center mb-5">
				<h1 className="fw-bold display-5 text-dark mb-2">
					<i className="bi bi-egg-fried text-danger me-2"></i> Tarif
					Defterim
				</h1>
				<p className="text-muted lead">
					En lezzetli tariflerinizi keşfedin, arayın ve yönetin
				</p>
			</div>

			<div className="row justify-content-center">
				{/* Tarif Ekleme Formu */}
				<div className="col-lg-8 mb-5">
					<div className="card form-card p-4 p-md-5">
						<h3 className="fw-bold mb-4 text-secondary">
							<i className="bi bi-plus-circle-fill text-danger me-2"></i>{" "}
							Yeni Tarif Oluştur
						</h3>
						<form onSubmit={handleSubmit}>
							<div className="row g-3">
								<div className="col-12">
									<label className="form-label fw-semibold text-muted">
										Tarif Adı
									</label>
									<input
										type="text"
										className="form-control form-control-lg bg-light border-0 py-3"
										placeholder="Örn: Kremalı Mantarlı Makarna"
										value={form.title}
										onChange={(e) =>
											setForm({ ...form, title: e.target.value })
										}
										required
									/>
								</div>
								<div className="col-12">
									<label className="form-label fw-semibold text-muted">
										Açıklama & Malzemeler
									</label>
									<textarea
										className="form-control bg-light border-0"
										rows="3"
										placeholder="Tarifin detayları ve yapılış aşamaları..."
										value={form.description}
										onChange={(e) =>
											setForm({
												...form,
												description: e.target.value,
											})
										}
									/>
								</div>
								<div className="col-md-6">
									<label className="form-label fw-semibold text-muted">
										Kategori
									</label>
									<input
										type="text"
										className="form-control bg-light border-0 py-2.5"
										placeholder="Örn: Akşam Yemeği"
										value={form.category}
										onChange={(e) =>
											setForm({ ...form, category: e.target.value })
										}
									/>
								</div>
								<div className="col-md-6">
									<label className="form-label fw-semibold text-muted">
										Hazırlık Süresi (Dakika)
									</label>
									<input
										type="number"
										className="form-control bg-light border-0 py-2.5"
										placeholder="Örn: 30"
										value={form.prepTimeMinutes}
										onChange={(e) =>
											setForm({
												...form,
												prepTimeMinutes: e.target.value,
											})
										}
									/>
								</div>
								<div className="col-12 mt-4">
									<button
										type="submit"
										className="btn btn-custom-primary w-100 py-3"
									>
										<i className="bi bi-check2-circle me-2"></i>{" "}
										Tarifi Kaydet
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>

				{/* Arama ve Filtreleme Bölümü */}
				<div className="col-12 mb-4">
					<div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
						<div className="row g-3">
							<div className="col-md-8">
								<div className="input-group input-group-lg">
									<span className="input-group-text bg-light border-0 text-muted">
										<i className="bi bi-search"></i>
									</span>
									<input
										type="text"
										className="form-control bg-light border-0"
										placeholder="Tarif adı veya açıklamalarda ara..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
							</div>
							<div className="col-md-4">
								<select
									className="form-select form-select-lg bg-light border-0"
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
								>
									<option value="">Tüm Kategoriler</option>
									{categories.filter(Boolean).map((cat, index) => (
										<option key={index} value={cat}>
											{cat}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>

				{/* Tarif Listesi */}
				<div className="col-12">
					<div className="d-flex align-items-center justify-content-between mb-4">
						<h2 className="fw-bold text-dark m-0">
							<i className="bi bi-journal-richtext text-danger me-2"></i>{" "}
							Kayıtlı Tarifler
						</h2>
						<span className="badge bg-danger rounded-pill px-3 py-2 fs-6">
							{filteredRecipes.length} Tarif Gösteriliyor
						</span>
					</div>

					{filteredRecipes.length === 0 ? (
						<div className="text-center py-5 bg-white rounded-4 shadow-sm border border-light">
							<i className="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
							<p className="text-muted fs-5">
								Aradığınız kriterlere uygun tarif bulunamadı.
							</p>
						</div>
					) : (
						<div className="row g-4">
							{filteredRecipes.map((recipe) => (
								<div key={recipe.id} className="col-md-6 col-lg-4">
									<div className="card recipe-card h-100 p-4 d-flex flex-column justify-content-between">
										<div>
											<div className="d-flex justify-content-between align-items-start mb-3">
												<h4 className="fw-bold text-dark m-0">
													{recipe.title}
												</h4>
												<button
													onClick={() => handleDelete(recipe.id)}
													className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2"
													title="Tarifi Sil"
													style={{ width: "36px", height: "36px" }}
												>
													<i className="bi bi-trash-fill"></i>
												</button>
											</div>
											<p
												className="text-muted mb-4"
												style={{ lineHeight: "1.6" }}
											>
												{recipe.description}
											</p>
										</div>
										<div className="d-flex align-items-center gap-2 pt-3 border-top border-light">
											{recipe.category && (
												<span className="custom-badge bg-danger-subtle text-danger">
													<i className="bi bi-tag-fill me-1"></i>{" "}
													{recipe.category}
												</span>
											)}
											{recipe.prepTimeMinutes && (
												<span className="custom-badge bg-primary-subtle text-primary">
													<i className="bi bi-clock-fill me-1"></i>{" "}
													{recipe.prepTimeMinutes} dk
												</span>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
