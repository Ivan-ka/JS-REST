package ru.egartech.stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.egartech.stock.model.Quote;


@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {

}
