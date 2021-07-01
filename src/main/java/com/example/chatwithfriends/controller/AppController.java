package com.example.chatwithfriends.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AppController {


    @GetMapping("/")
    public String roomForm(Model model) {
        return "/index";
    }

    @GetMapping("/index")
    public String getIndex(Model model) {
        return "/index";
    }

    @PostMapping("/index")
    public String chatForm(Model model) {
        return "redirect:/chating";
    }

    @GetMapping("/chatingGroup")
    public String chat(@RequestParam(value = "usernick") String usernick,
                       @RequestParam(value = "room") String room, Model model) {
        model.addAttribute("room", room);
        model.addAttribute("usernick", usernick);
        return "chatingGroup";
    }

}
