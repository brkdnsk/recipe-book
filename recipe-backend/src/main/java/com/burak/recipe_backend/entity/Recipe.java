package com.recipe.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recipes") // Veritabanında oluşacak tablonun adı
@Data                    // Lombok: Otomatik olarak Getter, Setter, toString metotlarını üretir
@NoArgsConstructor       // Lombok: Boş constructor (yapıcı metot) oluşturur
@AllArgsConstructor      // Lombok: Tüm alanları içeren dolu constructor oluşturur
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID'nin otomatik 1, 2, 3 diye artmasını sağlar (Auto-increment)
    private Long id;

    @Column(nullable = false, length=40)
    private String title;

    @Column(nullable = false, length = 1000) // İçerik alanı zorunlu ve maksimum 1000 karakter
    private String description;

    private String category; // Örn: Tatlı, Çorba, Ana Yemek vb.

    private Integer prepTimeMinutes; // Hazırlama süresi (dakika cinsinden)
}