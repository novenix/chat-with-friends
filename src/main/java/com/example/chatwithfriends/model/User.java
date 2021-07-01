package com.example.chatwithfriends.model;


import java.util.List;

import javax.websocket.Session;

public class User {

    private String room;

    private String usernick;

    private List<String> messages;

    private Session session;


    public User(String usernick, String room, Session session) {
        this.usernick = usernick;
        this.room = room;
        this.session = session;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getUsername() {
        return usernick;
    }

    public void setUsername(String username) {
        this.usernick = username;
    }

    public List<String> getMessages() {
        return messages;
    }

    public void setMessages(List<String> messages) {
        this.messages = messages;
    }


    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }



}
