export class Message {
    action: string

    constructor(
        public type: string, // publish, subscribe, unsubscribe
        public subject: string | null,
        public method: string | null, // create, update, delete
        public data: any
    ) {
        this.action = 'message'
    }
}
