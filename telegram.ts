/*******************************************************************************
 * Functions for Telegram
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// Telegram API url.
const TELEGRAM_API_URL = "10.10.10.31/endpoint/yo"

namespace esp8266 {
    // Flag to indicate whether the Telegram message was sent successfully.
    let telegramMessageSent = false



    /**
     * Return true if the Telegram message was sent successfully.
     */
    //% subcategory="Telegram"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_telegram_message_sent
    //% block="Telegram message sent"
    export function isTelegramMessageSent(): boolean {
        return telegramMessageSent
    }



    /**
     * Send Telegram message.
     * @param toKen Telegram API Key.
     * @param mesSage The chat ID we want to send message to.
     */
    //% subcategory="Telegram"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_send_telegram_message
    //% block="send message to Telegram:|Token %toKen|Message %mesSage"
    export function sendTelegramMessage(toKen: string, mesSage: string) {

        // Reset the upload successful flag.
        telegramMessageSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to Telegram. Return if failed.
        if (sendCommand("AT+CIPSTART=\"TCP\",\"" + TELEGRAM_API_URL + "\",443", "OK", 10000) == false) return

        // Construct the data to send.
        let data = "POST /api/notify HTTP/1.1\r\nHost:https://notify-api.line.me/api/notify\r\nContent-Type: application/x-www-form-urlencoded\r\nAuthorization: Bearer EfsT3yVHLqHeJgMFKGBtxz7MeWMEDCt5DX6AzCbs1mr\r\nmessage=hola"
        //data += " HTTP/1.1\r\n"
        //data += "Host: " + TELEGRAM_API_URL + "\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)

        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Validate the response from Telegram.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        telegramMessageSent = true
        return
    }

}
