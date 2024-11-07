export class User {

    constructor(
        public id: number,
        public uuid: string,
        public username: string,
        public email: string
    ) {
        this.id = id
        this.uuid = uuid
        this.username = username
        this.email = email
    }

    
}