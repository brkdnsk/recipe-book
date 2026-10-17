import axios from "axios";
import React, { useEffect, useState } from "react";
import {
	Alert,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

// NOT: Bilgisayarında test ederken backend'e bağlanmak için:
// - iOS Simülatör için: http://localhost:8080/api/recipes
// - Android Emülatör için: http://10.0.2.2:8080/api/recipes
// - Gerçek cihaz (Expo Go) için bilgisayarının yerel IP adresi (örn: http://192.168.1.50:8080/api/recipes) kullanılmalıdır.
const API_URL = "http://localhost:8080/api/recipes";

export default function App() {
	const [recipes, setRecipes] = useState([]);
	const [form, setForm] = useState({
		title: "",
		description: "",
		category: "",
		prepTimeMinutes: "",
	});

	const fetchRecipes = async () => {
		try {
			const response = await axios.get(API_URL);
			setRecipes(response.data);
		} catch (error) {
			console.error("Tarifler yüklenirken hata oluştu:", error);
		}
	};

	useEffect(() => {
		fetchRecipes();
	}, []);

	const handleSubmit = async () => {
		if (!form.title.trim()) {
			Alert.alert("Hata", "Lütfen bir tarif adı girin.");
			return;
		}

		try {
			await axios.post(API_URL, {
				...form,
				prepTimeMinutes: form.prepTimeMinutes
					? Number(form.prepTimeMinutes)
					: 0,
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
			Alert.alert("Hata", "Tarif eklenemedi.");
		}
	};

	const handleDelete = async (id) => {
		Alert.alert("Tarifi Sil", "Bu tarifi silmek istediğinize emin misiniz?", [
			{ text: "Vazgeç", style: "cancel" },
			{
				text: "Sil",
				style: "destructive",
				onPress: async () => {
					try {
						await axios.delete(`${API_URL}/${id}`);
						fetchRecipes();
					} catch (error) {
						console.error("Tarif silinirken hata oluştu:", error);
					}
				},
			},
		]);
	};

	const renderRecipeItem = ({ item }) => (
		<View style={styles.recipeCard}>
			<View style={styles.cardHeader}>
				<Text style={styles.recipeTitle}>{item.title}</Text>
				<TouchableOpacity onPress={() => handleDelete(item.id)}>
					<Text style={styles.deleteText}>🗑️</Text>
				</TouchableOpacity>
			</View>
			{item.description ? (
				<Text style={styles.recipeDesc}>{item.description}</Text>
			) : null}
			<View style={styles.metaContainer}>
				{item.category ? (
					<View style={styles.badgeCategory}>
						<Text style={styles.badgeCategoryText}>{item.category}</Text>
					</View>
				) : null}
				{item.prepTimeMinutes ? (
					<View style={styles.badgeTime}>
						<Text style={styles.badgeTimeText}>
							⏱️ {item.prepTimeMinutes} dk
						</Text>
					</View>
				) : null}
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>🍳 Tarif Defterim</Text>
					<Text style={styles.headerSub}>Mobil Sürüm</Text>
				</View>

				{/* Form Alanı */}
				<View style={styles.formCard}>
					<TextInput
						style={styles.input}
						placeholder="Tarif Adı"
						placeholderTextColor="#999"
						value={form.title}
						onChangeText={(text) => setForm({ ...form, title: text })}
					/>
					<TextInput
						style={styles.input}
						placeholder="Açıklama / Malzemeler"
						placeholderTextColor="#999"
						value={form.description}
						onChangeText={(text) =>
							setForm({ ...form, description: text })
						}
					/>
					<View style={styles.row}>
						<TextInput
							style={[styles.input, styles.halfInput]}
							placeholder="Kategori"
							placeholderTextColor="#999"
							value={form.category}
							onChangeText={(text) =>
								setForm({ ...form, category: text })
							}
						/>
						<TextInput
							style={[styles.input, styles.halfInput]}
							placeholder="Süre (dk)"
							placeholderTextColor="#999"
							keyboardType="numeric"
							value={form.prepTimeMinutes}
							onChangeText={(text) =>
								setForm({ ...form, prepTimeMinutes: text })
							}
						/>
					</View>
					<TouchableOpacity
						style={styles.submitButton}
						onPress={handleSubmit}
					>
						<Text style={styles.submitButtonText}>Tarifi Ekle</Text>
					</TouchableOpacity>
				</View>

				{/* Liste Alanı */}
				<FlatList
					data={recipes}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderRecipeItem}
					contentContainerStyle={styles.listContainer}
					showsVerticalScrollIndicator={false}
					ListHeaderComponent={
						<Text style={styles.listHeader}>
							Kayıtlı Tarifler ({recipes.length})
						</Text>
					}
				/>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f7f5ef",
	},
	keyboardView: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	header: {
		alignItems: "center",
		marginBottom: 20,
	},
	headerTitle: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#1a202c",
	},
	headerSub: {
		fontSize: 14,
		color: "#718096",
	},
	formCard: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 16,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 3,
	},
	input: {
		backgroundColor: "#faf8f5",
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 15,
		color: "#2d3748",
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	halfInput: {
		width: "48%",
	},
	submitButton: {
		backgroundColor: "#e05a47",
		borderRadius: 10,
		paddingVertical: 14,
		alignItems: "center",
		marginTop: 4,
		shadowColor: "#e05a47",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	submitButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
	},
	listContainer: {
		paddingBottom: 30,
	},
	listHeader: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#1a202c",
		marginBottom: 12,
	},
	recipeCard: {
		backgroundColor: "#ffffff",
		borderRadius: 14,
		padding: 16,
		marginBottom: 14,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.04,
		shadowRadius: 6,
		elevation: 2,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 6,
	},
	recipeTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#1a202c",
		flex: 1,
	},
	deleteText: {
		fontSize: 16,
	},
	recipeDesc: {
		fontSize: 14,
		color: "#718096",
		marginBottom: 12,
		lineHeight: 20,
	},
	metaContainer: {
		flexDirection: "row",
		gap: 8,
	},
	badgeCategory: {
		backgroundColor: "#fff5f5",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 20,
	},
	badgeCategoryText: {
		color: "#e53e3e",
		fontSize: 12,
		fontWeight: "600",
	},
	badgeTime: {
		backgroundColor: "#ebf8ff",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 20,
	},
	badgeTimeText: {
		color: "#3182ce",
		fontSize: 12,
		fontWeight: "600",
	},
});
