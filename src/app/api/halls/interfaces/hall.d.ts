export interface IHall {
    id: string;
    displayId: string;
    name: string;
    capacity: number;
    slots: string[];
    price: number;
    isActive: boolean;
    isDeleted: boolean;
}