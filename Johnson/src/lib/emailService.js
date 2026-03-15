import { supabase } from './supabaseClient';

/**
 * emailService.js
 * Centralized service to handle email notifications by calling Supabase Edge Functions.
 * This replaces the fragile database triggers for better reliability and visibility.
 */

const emailService = {
    /**
     * Internal helper to fetch configuration and call the Edge Function
     */
    async _callEdgeFunction(payload) {
        try {
            // We use the built-in invoke method. 
            // This is SECURE as it doesn't require fetching secrets to the browser.
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: payload,
            });

            if (error) {
                console.error('Edge Function error:', error);
                return { success: false, error };
            }

            return { success: true, data };
        } catch (err) {
            console.error('Email service failure:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Sends an order notification (Customer confirmation + Admin alert)
     */
    async sendOrderNotification({ name, email, productTitle, amount, orderId, fileUrl, saleEvent, saleLabel, type = 'purchase_confirmation' }) {
        // Step 1: Send Customer Confirmation
        await this._callEdgeFunction({
            type,
            email,
            name,
            product_title: productTitle,
            amount_tzs: amount,
            order_id: orderId,
            file_url: fileUrl,
            sale_event: saleEvent,
            sale_label: saleLabel
        });

        // Step 2: Send Admin Alert (Edge function handles routing based on admin_ prefix)
        return await this._callEdgeFunction({
            type: 'admin_order_notification',
            name,
            customer_email: email,
            product_title: productTitle,
            amount_tzs: amount,
            order_id: orderId
        });
    },

    /**
     * Sends a contact form notification
     */
    async sendContactNotification({ name, email, subject, message }) {
        // Step 1: Send Customer "Thank You"
        await this._callEdgeFunction({
            type: 'contact_received',
            email,
            name,
            subject
        });

        // Step 2: Send Admin Alert
        return await this._callEdgeFunction({
            type: 'admin_contact_notification',
            name,
            customer_email: email,
            subject,
            sender_message: message
        });
    },

    /**
     * Sends a welcome email for newsletter subscribers
     */
    async sendWelcomeEmail({ name, email }) {
        return await this._callEdgeFunction({
            type: 'welcome',
            email,
            name: name || "Friend"
        });
    }
};

export default emailService;
