import parserPhoneNumber, {isValidPhoneNumber} from "libphonenumber-js"
import { start } from "repl"
import {create, Whatsapp, Message, SocketState} from "venom-bot"


export type QRCode = {
    base64Qr: string
    attempts: number
}


class Sender {
    private client: Whatsapp
    private connected: boolean;
    private qr: QRCode;

    get isConnected() : boolean {
        return this.connected
    }
    
    get qrCode() : QRCode {
        return this.qr
    }

    constructor(){
        this.initialize()
    }

    async sendText(to: string, body: string){
        //"14503007366@c.us"
        let phoneNumber = to?.replace("+", "")?.replace("(", "")
        ?.replace(")", "")?.replace("-", "")?.replace(" ", "")
        phoneNumber = phoneNumber.includes("@c.us") 
        ? phoneNumber 
        : `${phoneNumber}@c.us`

        console.log("phoneNumber", phoneNumber)
        await this.client.sendText(to, body)
    }

    private initialize(){
        const qr = (base64Qr: string, asciiQR: string, attempts: number, ) => {
            this.qr = { base64Qr, attempts}
        }

        const status = (statusSession: string) => {
            this.connected = ["isLogged", "qrReadSuccess", "chatsAvailable"].includes(
                statusSession
            )           
        }

        const start = (client: Whatsapp) => {
             this.client = client

             client.onStateChange((state) => {
                this.connected = state === SocketState.CONNECTED
             })
             
        }

        create("ws-sender-dev", qr, status)
        .then((client) => start(client))
        .catch((error) => console.error(error))
        
    }
}


export default Sender