package com.recipe.backend.service;

import com.recipe.backend.model.Recipe;
import com.recipe.backend.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // Bu sınıfın bir iş mantığı (Service) bileşeni olduğunu Spring'e söyler
@RequiredArgsConstructor // Lombok: 'final' olarak tanımlanan alanlar için otomatik constructor üretir
public class RecipeService {

    private final RecipeRepository recipeRepository;

    // 1. Tüm tarifleri listeleme
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    // 2. ID'ye göre tek bir tarif bulma
    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    // 3. Yeni tarif kaydetme veya mevcut tarifi güncelleme
    public Recipe saveRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    // 4. ID'ye göre tarif silme
    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }
}