package ru.egartech.stock.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.egartech.stock.model.Quote;
import ru.egartech.stock.service.QuoteService;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("quotes")
public class QuoteController {
    private final QuoteService quoteService;


    @Autowired
    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }


    @PostMapping
    public ResponseEntity<Quote> addQuote(@Valid @RequestBody Quote quote) {
        quote = quoteService.addUpdate(quote);
        return new ResponseEntity<>(quote, HttpStatus.CREATED);
    }


    @PutMapping("{id}")
    public ResponseEntity<Quote> updateQuote(@Valid @RequestBody Quote quote, @PathVariable("id") String id) {
        quote = quoteService.addUpdate(quote);

        if (!Long.valueOf(id).equals(quote.getId())) {
            return new ResponseEntity<>(quote, HttpStatus.CREATED);
        }

        return new ResponseEntity<>(quote, HttpStatus.OK);
    }


    @GetMapping
    public ResponseEntity<List<Quote>> getAllQuotes() {
        List<Quote> quotes = quoteService.getAll();
        return new ResponseEntity<>(quotes, HttpStatus.OK);
    }


    @DeleteMapping("{id}")
    public ResponseEntity<Quote> deleteQuote(@PathVariable("id") String id) {
        quoteService.delete(Long.valueOf(id));
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
