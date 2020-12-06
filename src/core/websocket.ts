import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'

import { Message } from './message'
import { webSocketOptions } from './types'

export class WebSocket {

    private url: string
    private userId: string
    private webSocketSubject$: WebSocketSubject<any>

    constructor(options: webSocketOptions) {
        const { url, userId } = options;
        this.url = url
        this.userId = userId
        this.webSocketSubject$ = null
    }

    private createWebSocket(): WebSocketSubject<any> {
        return webSocket({
            url: this.url,
            openObserver: {
                next: () => {
                    console.log('Socket Open')
                    let initMsg = this.getMessage('init', null, null, {})
                    this.send(initMsg)
                }
            },
            closeObserver: {
                next: () => {
                    console.log('Socket Closed')
                    this.webSocketSubject$ = null
                }
            },
            deserializer: (e) => JSON.parse(e.data),
            serializer: (v) => JSON.stringify(v)
        })
    }

    private getMessage(type: string, subject: string, method: string, data: any): Message {
        return new Message(type, subject, method, { ...data, userId: this.userId })
    }

    private send(message: Message) {
        this.webSocketSubject$.next(message)
    }

    public connect() {
        if (!this.webSocketSubject$) {
            this.webSocketSubject$ = this.createWebSocket()
            this.webSocketSubject$.subscribe()
        }
    }

    public disconnect() {
        if (this.webSocketSubject$) {
            this.url = ''
            this.userId = ''
            this.webSocketSubject$.unsubscribe()
        }
    }

    public getChannel(subject: string, data: any): Observable<any> {
        let subMsg: Message = this.getMessage('subscribe', subject, null, data)
        let unsubMsg: Message = this.getMessage('unsubscribe', subject, null, data)

        return this.webSocketSubject$.multiplex(
            () => (subMsg),
            () => (unsubMsg),
            message => message.subject === subject
        )
    }

    public publish(subject: string, method: string, data: any) {
        let pubMsg: Message = this.getMessage('publish', subject, method, data)
        this.send(pubMsg)
    }

}