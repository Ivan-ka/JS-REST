package ru.egartech.stock.service;

import ru.egartech.stock.model.Quote;

import java.util.List;


public interface QuoteService {

    Quote addUpdate(Quote quote);

    List<Quote> getAll();

    void delete(Long id);

}
