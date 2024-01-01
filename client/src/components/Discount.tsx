// services/product.ts
import { getAllDiscount } from "../services/product";

export interface ListItemDiscount {
    Id?: string;
    Discount_Percent: number;
    NameVI?: string;
    NameEN?: string;
    Quantity: number;
    DateStart: Date;
    DateEnd: Date;
}

export const getListDiscount = async () => {
    try {
        // Move the import statement inside the function
        const list = await getAllDiscount();
        const dataItems: ListItemDiscount[] = list.data.items.map((i: ListItemDiscount) => ({
            Id: i.Id,
            Discount_Percent: i.Discount_Percent,
            NameVI: i.NameVI,
            NameEN: i.NameEN,
            Quantity: i.Quantity,
            DateStart: i.DateStart,
            DateEnd: i.DateEnd
        }));

        return dataItems;
    } catch (e) {
        console.log(e);
        throw e;
    }
};
