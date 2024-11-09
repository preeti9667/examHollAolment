export interface IHall {
    id: string;
    displayId: string;
    name: string;
    capacity: number;
    slots: string[];
    isActive: boolean;
    isDeleted: boolean;
}