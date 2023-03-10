/*******************************************************************************
 * Functions for Telegram
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// Line API url.
const LINE_API_URL = "notify-api.line.me"
const CONTENT_TYPE = "application/x-www-form-urlencoded"
namespace esp8266 {
    // Flag to indicate whether the Telegram message was sent successfully.
    let lineMessageSent = false



    /**
     * Return true if the Telegram message was sent successfully.
     */
    //% subcategory="Line"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_line_message_sent
    //% block="Line message sent"
    export function isLineMessageSent(): boolean {
        return lineMessageSent
    }



    /**
     * Send Line message.
     * @param toKen Line token.
     * @param mesSage Message that we want to send.
     */
    //% subcategory="Line"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_send_line_message
    //% block="send message to Line:|Token %toKen|Message %mesSage"
    export function sendLineMessage(toKen: string, mesSage: string) {

        // Reset the upload successful flag.
        lineMessageSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to Line. Return if failed.
        if (sendCommand("AT+CIPSTART=\"TCP\",\"" + LINE_API_URL + "\",80", "OK", 10000) == false) return

        // Construct the data to send.
        let data = "POST /api/notify"
        data += " HTTP/1.1\r\n"
        data += "Host: " + LINE_API_URL + "\r\n"
        data += "Content-Type: " + CONTENT_TYPE + "\r\n"
        data += "Authorization: Bearer " + formatUrl(toKen) + "\r\n"
        data += "message:" + formatUrl(mesSage) + "\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)

        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Validate the response from Line.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        lineMessageSent = true
        return
    }

}
