package com.avito.models;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "posting")
public class Posting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "posting_id")
    private Long id;

    private String title;

    private long price;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "full_description")
    private String fullDescription;

    @Column(name = "user_id")
    private Long userId;

    @OneToOne(cascade = CascadeType.ALL)
    private Category category;

    @Column(name = "image_path")
    private String imagePath;

    public Posting() {
    }

    public Posting(String title, String shortDescription, String fullDescription, Long userId, Category category, String imagePath) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.userId = userId;
        this.category = category;
        this.imagePath = imagePath;
    }

}