package com.burak.recipe_backend.controller;

import com.burak.recipe_backend.entity.Recipe;
import com.burak.recipe_backend.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping
    public List<Recipe> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        return recipeService.getRecipeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Recipe createRecipe(@RequestBody Recipe recipe) {
        return recipeService.saveRecipe(recipe);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipeDetails) {
        return recipeService.getRecipeById(id)
                .map(existingRecipe -> {
                    existingRecipe.setTitle(recipeDetails.getTitle());
                    existingRecipe.setDescription(recipeDetails.getDescription());
                    existingRecipe.setCategory(recipeDetails.getCategory());
                    existingRecipe.setPrepTimeMinutes(recipeDetails.getPrepTimeMinutes());

                    Recipe updatedRecipe = recipeService.saveRecipe(existingRecipe);
                    return ResponseEntity.ok(updatedRecipe);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        if (recipeService.getRecipeById(id).isPresent()) {
            recipeService.deleteRecipe(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}