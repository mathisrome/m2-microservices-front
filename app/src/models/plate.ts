export class Plate {

    constructor(
        public id: number,
        public name: string,
        public price: number,
        public plateType: number,
    ) {
        this.id = id
        this.name = name
        this.price = price
        this.plateType = plateType
    }

    
}