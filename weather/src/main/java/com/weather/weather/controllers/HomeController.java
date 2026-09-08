package com.weather.weather.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller 
public class HomeController {
    
    @GetMapping("/")
    public String testHelloWorld() {
        return "index.html";
    }
    
}
