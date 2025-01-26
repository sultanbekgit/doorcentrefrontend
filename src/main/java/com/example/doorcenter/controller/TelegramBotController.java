package com.example.doorcenter.controller;


import com.example.doorcenter.NotificationBot;
import com.example.doorcenter.OrderCustomerRequest;
import com.example.doorcenter.TelegramNotificationService;
import com.example.doorcenter.customer.Customer;
import com.example.doorcenter.order.Orders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/bot")
public class TelegramBotController {


    @Autowired
    private NotificationBot notificationBot;

    @PostMapping("/get-order")
    public void getOrderAndCustomer(@RequestBody OrderCustomerRequest request) {
        // Save the order logic
        List<Orders> orders = request.getOrders();
        Customer customer = request.getCustomer();

        // Build a message for multiple orders
        StringBuilder messageBuilder = new StringBuilder();
        messageBuilder.append("🆕 *Получен новый заказ!*\n\n");

        double totalPrice = 0;

        for (Orders order : orders) {
            double orderTotal = order.getPrice() * order.getQuantity();
            totalPrice += orderTotal;

            messageBuilder.append("📦 *Детали заказа:*\n")
                    .append("• Название: *").append(order.getName()).append("*\n")
                    .append("• Цена: ").append(order.getPrice()).append("₸\n")
                    .append("• Количество: ").append(order.getQuantity()).append("\n")
                    .append("• Всего: *").append(orderTotal).append("₸*\n\n");
        }

        messageBuilder.append("💰 *Общая сумма заказа: *").append(totalPrice).append("₸\n\n")
                .append("👤 *Детали клиента:*\n")
                .append("• Номер телефона: *").append(customer.getPhoneNumber()).append("*\n");

        // Log the details for debugging
        System.out.println("Заказы и клиент получены: " + messageBuilder);

        // Send the notification
        notificationBot.sendNotification(messageBuilder.toString());
    }


}

