export interface ExpenseListItem {
    id:number;
    name:string;
    amount:number;
    budgetId:number | null;
    createdAt:string;
}