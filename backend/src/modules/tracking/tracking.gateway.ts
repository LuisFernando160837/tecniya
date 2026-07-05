import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);
  private activeConnections: Map<string, { socketId: string; userId: string; rol: string }> = new Map();

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.token as string;
      if (!token) {
        client.emit('error', 'Token requerido');
        client.disconnect();
        return;
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET || 'tecniya-jwt-secret') as any;
      this.activeConnections.set(client.id, {
        socketId: client.id,
        userId: payload.sub,
        rol: payload.rol,
      });

      client.join(`user:${payload.sub}`);
      this.logger.log(`Cliente conectado: ${payload.sub} (${payload.rol})`);
    } catch {
      client.emit('error', 'Token inválido');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.activeConnections.delete(client.id);
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('tracking:start')
  async handleTrackingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { solicitud_id: string },
  ) {
    client.join(`solicitud:${data.solicitud_id}`);
    this.logger.log(`Tracking iniciado para solicitud ${data.solicitud_id}`);
  }

  @SubscribeMessage('tracking:ubicacion')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { solicitud_id: string; lat: number; lng: number },
  ) {
    const connection = this.activeConnections.get(client.id);
    if (!connection || connection.rol !== 'tecnico') return;

    this.server.to(`solicitud:${data.solicitud_id}`).emit('tracking:ubicacion_actualizada', {
      tecnico_id: connection.userId,
      lat: data.lat,
      lng: data.lng,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('tracking:estado')
  async handleStatusUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { solicitud_id: string; estado: string; mensaje?: string },
  ) {
    this.server.to(`solicitud:${data.solicitud_id}`).emit('tracking:estado_actualizado', {
      estado: data.estado,
      mensaje: data.mensaje || '',
      timestamp: new Date().toISOString(),
    });
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
