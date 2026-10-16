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
		<div className="container py-5 animated-container">
			{/* Header */}
			<div className="text-center mb-5">
				<h1 className="fw-bold display-5 text-dark mb-2">
					<i className="bi bi-egg-fried text-danger me-2"></i> Tarif
					Defterim
				</h1>
				<p className="text-muted lead">
					En lezzetli tariflerinizi modern ve akıcı bir arayüzle yönetin
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

				{/* Tarif Listesi */}
				<div className="col-12">
					<div className="d-flex align-items-center justify-content-between mb-4">
						<h2 className="fw-bold text-dark m-0">
							<i className="bi bi-journal-richtext text-danger me-2"></i>{" "}
							Kayıtlı Tarifler
						</h2>
						<span className="badge bg-danger rounded-pill px-3 py-2 fs-6">
							{recipes.length} Tarif
						</span>
					</div>

					{recipes.length === 0 ? (
						<div className="text-center py-5 bg-white rounded-4 shadow-sm border border-light">
							<i className="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
							<p className="text-muted fs-5">
								Henüz hiç tarif eklenmemiş. İlk tarifini yukarıdan hemen
								oluştur!
							</p>
						</div>
					) : (
						<div className="row g-4">
							{recipes.map((recipe) => (
								<div key={recipe.id} className="col-md-6 col-lg-4">
									<div className="card recipe-card h-100 p-4 d-flex flex-column justify-content-between">
										<div>
											<h4 className="fw-bold text-dark mb-3">
												{recipe.title}
											</h4>
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
