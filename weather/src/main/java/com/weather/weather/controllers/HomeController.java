package com.weather.weather.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController 
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class HomeController {

        @Value("${openweather.api.key}")
        private String apiKey;
        private final RestClient restClient = RestClient.create();

        
        @GetMapping("/weather")
        public Map <String, Object> getLiveWeather(
                @RequestParam(required = false) String city,
                @RequestParam(required = false) Double lat,
                @RequestParam(required = false) Double lon)
                {
                try {
                        String url;
                        if (lat != null && lon != null){
                                url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric";
                        }
                        else if (city != null & !city.isBlank()){
                                url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
                        } else {
                                url = "https://api.openweathermap.org/data/2.5/weather?q=Madrid&appid=" + apiKey + "&units=metric";
                        }
                       
                        //generic response from OpenWeather
                         Map<?, ?> openWeatherResponse = restClient.get().uri(url).retrieve().body(Map.class);

                        //custom response for the frontend
                        Map <String, Object> customResponse = new HashMap<>();

                        if (openWeatherResponse != null){
                                customResponse.put("City", openWeatherResponse.get("name"));
                        }

                        //extract humidity and temperature
                        Map<?, ?> mainData = (Map<?, ?>) openWeatherResponse.get("main");

                         if (mainData != null){
                                customResponse.put("Temperature", mainData.get("temp"));
                                customResponse.put("Humidity", mainData.get("humidity"));
                        }

                        //extract weather description from the generic response
                        List<?> weatherList = (List<?>) openWeatherResponse.get("weather");

                        if (weatherList != null && !weatherList.isEmpty()){
                                Map<?, ?> weatherDetail = (Map<?, ?>) weatherList.get(0);
                                customResponse.put("Condition", weatherDetail.get("description"));     

                        }
                 
                return customResponse;


                } catch(Exception e){
                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("error", "Could not fetch live weather. Please check the city name.");
                        errorResponse.put("details", e.getMessage());
                return errorResponse;
                }   
        }

}