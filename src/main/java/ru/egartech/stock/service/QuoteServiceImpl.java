package ru.egartech.stock.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.egartech.stock.model.Quote;
import ru.egartech.stock.repository.QuoteRepository;

import java.util.List;


@Service
public class QuoteServiceImpl implements QuoteService{
    private final QuoteRepository quoteRepository;


    @Autowired
    public QuoteServiceImpl(QuoteRepository quoteRepository) {
        this.quoteRepository = quoteRepository;
    }


    @Override
    public Quote addUpdate(Quote quote) {
        return quoteRepository.save(quote);
    }


    @Override
    public List<Quote> getAll() {
        return quoteRepository.findAll();
    }


    @Transactional
    @Override
    public void delete(Long id) {
        quoteRepository.deleteById(id);
    }

}
