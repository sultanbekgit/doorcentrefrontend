package com.example.doorcenter;


import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;



@Service
public class NotificationBot extends TelegramLongPollingBot {
    private final String BOT_USERNAME = "@Agent_Sula_bot"; // Replace with your bot's username
    private final String BOT_TOKEN = "8086466749:AAEr8Wc-UG81z9k-QoryI0STnzhtbD9OoK0"; // Replace with your bot's token
    private final long CHAT_ID = 667268580; // Replace with the recipient's chat ID

    @Override
    public String getBotUsername() {
        return BOT_USERNAME;
    }

    @Override
    public String getBotToken() {
        return BOT_TOKEN;
    }


    @Override
    public void onUpdateReceived(Update update) {
        // Handle incoming messages (optional)
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();

            // Respond to the user's message
            SendMessage response = new SendMessage();
            response.setChatId(chatId);
            response.setText("You said: " + messageText);
            try {
                execute(response);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        }
    }

    // Method to send a notification
    public void sendNotification(String message) {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(CHAT_ID);
        sendMessage.setText(message);
        try {
            execute(sendMessage);
            System.out.println("Notification sent: " + message);
        } catch (TelegramApiException e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
}

