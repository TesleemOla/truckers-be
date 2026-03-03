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
        const payload = {
            manifestId,
            location,
            timestamp: new Date(),
        };

        // Send to specific manifest room
        this.server.to(`manifest_${manifestId}`).emit('locationUpdated', payload);

        // Also emit globally for the admin map/dashboard to see all updates
        this.server.emit('allLocationUpdates', payload);
    }

    sendTruckLocationUpdate(truckId: string, location: any) {
        const payload = {
            truckId,
            location,
            timestamp: new Date(),
        };

        // Emit to specific truck room (if any client joined truck room)
        this.server.to(`truck_${truckId}`).emit('truckLocationUpdated', payload);

        // Also emit globally
        this.server.emit('allTruckLocationUpdates', payload);
    }
}
