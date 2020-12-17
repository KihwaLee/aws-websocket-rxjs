import { Observable } from 'rxjs'

import { WebSocket } from './core/websocket'
import { webSocketOptions } from './core/types'

export class ChatService {
    ws: WebSocket

    constructor(options: webSocketOptions) {
        this.ws = new WebSocket(options)
    }

    public connect(): void {
        this.ws.connect()
    }

    public disconnect(): void {
        this.ws.disconnect()
    }

    public getMemberList(gymId: string): Observable<any> | undefined {
        return this.ws.getChannel('member', { gymId: gymId })
    }

    public setMember(gymId: string): void {
        this.ws.publish('member', 'create', { gymId: gymId })
    }
}
