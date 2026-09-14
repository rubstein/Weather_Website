package com.weather.weather.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController 
@RequestMapping ("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class HomeController{
    
    @GetMapping("/weather/test")
    public Map<String, Object> testHelloWorld(){
        Map<String, Object> weatherData = new HashMap<>();

        weatherData.put("city", "Madrid");
        weatherData.put("temperature", 22);
        weatherData.put("condition", "Sunny");
        weatherData.put("Humidity", 60);

        return weatherData;

    }
    
}