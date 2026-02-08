import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'location',
})
export class LocationGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('joinManifest')
    handleJoinManifest(
        @ConnectedSocket() client: Socket,
        @MessageBody() manifestId: string,
    ) {
        if (manifestId) {
            client.join(`manifest_${manifestId}`);
            console.log(`Client ${client.id} joined room: manifest_${manifestId}`);
            return { event: 'joined', data: manifestId };
        }
    }

    sendLocationUpdate(manifestId: string, location: any) {
        this.server.to(`manifest_${manifestId}`).emit('locationUpdated', {
            manifestId,
            location,
            timestamp: new Date(),
        });
    }
}
