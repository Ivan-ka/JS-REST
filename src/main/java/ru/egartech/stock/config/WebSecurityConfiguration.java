package ru.egartech.stock.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/h2-console/**", "/**").permitAll()
                .anyRequest()
                .authenticated();

        httpSecurity.csrf().disable();
        httpSecurity.headers().frameOptions().disable();
    }

}
