export interface Delay{
    name: string, 
    amount:number
    delays: {
        id: string,
        category: string,
        priority: string,
        from: string,
        to: string
    }[]
}