package com.board_of_ads.models;

import com.board_of_ads.models.posting.Posting;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String text;

    @NonNull
    private LocalDateTime date;

    @NonNull
    @ManyToOne(cascade = {CascadeType.REFRESH})
    @JoinColumn(name = "posting_id")
    private Posting posting;

    @NonNull
    @ManyToOne(cascade = {CascadeType.REFRESH})
    @JoinColumn(name = "user_id")
    private User author;

    @NonNull
    @Enumerated(EnumType.STRING)
    private ReadStatus readStatus = ReadStatus.NOT_READ;

    public enum ReadStatus {
        READ,
        NOT_READ
    }

    public User getRecipient() {
        return posting.getUser();
    }

}
