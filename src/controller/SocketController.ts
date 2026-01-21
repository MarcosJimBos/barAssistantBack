// socket-manager.ts
import { Server, Socket } from 'socket.io';
import * as http from "http";

export class SocketController {
    private static io: Server;

    static initSocket(server: http.Server) {
        this.io = new Server(server, {
            cors: { origin: "*" } // Ajusta-ho segons les teues necessitats
        });
        console.log("🚀 Socket.io inicialitzat");
        this.setupListeners();
    }
    /**
     * Configura els escoltadors principals
     */
    private static setupListeners() {
        this.io.on("connection", (socket: Socket) => {
            console.log(`📡 Nou dispositiu connectat: ${socket.id}`);
            // Escolta quan una tablet demana unir-se a una sala (cuina/barra)
            socket.on("join_room", (roomName: string) => {
                socket.join(roomName);
                console.log(`👥 El socket ${socket.id} s'ha unit a: ${roomName}`);
            });

            // Gestió de desconnexió
            socket.on("disconnect", () => {
                console.log(`❌ Dispositiu desconnectat: ${socket.id}`);
            });
        });
    }
    /**
     * Mètode per enviar missatges a una sala específica des de qualsevol lloc
     * @param room El nom de la sala ('cuina' o 'barra')
     * @param event El nom de l'esdeveniment ('comanda_nova')
     * @param data Els productes o informació a enviar
     */
    static sendMessageToRoom(room: string, event: string, data: any) {
        if (!this.io) {
            console.error("Socket.io no ha estat inicialitzat!");
            return;
        }
        // Aquest és el mètode clau: enviament selectiu
        this.io.to(room).emit(event, data);
        console.log(`📤 Missatge enviat a la sala [${room}] com a [${event}]:`, data);
    }
}