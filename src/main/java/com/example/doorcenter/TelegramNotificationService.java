package com.example.doorcenter;

import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.DefaultAbsSender;
import org.telegram.telegrambots.bots.DefaultBotOptions;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

@Service
public class TelegramNotificationService {

    private final String BOT_TOKEN = "8086466749:AAEr8Wc-UG81z9k-QoryI0STnzhtbD9OoK0"; // Replace with your bot's token
    private final String CHAT_ID = "667268580"; // Replace with the recipient's chat ID
    int a=0;

    public void sendNotification(String message) {
        DefaultAbsSender sender = new DefaultAbsSender(new DefaultBotOptions()) {
            @Override
            public String getBotToken() {
                return BOT_TOKEN;
            }
        };

        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(CHAT_ID);
        sendMessage.setText(message);

        try {
            sender.execute(sendMessage);
            System.out.println("Notification sent: " + message);
        } catch (TelegramApiException e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
}