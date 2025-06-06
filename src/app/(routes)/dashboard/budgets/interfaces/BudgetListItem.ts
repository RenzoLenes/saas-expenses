export interface BudgetListItem {
    id: number;
    name: string;
    amount: number;
    icon: string | null;
    createdBy: string;
    totalSpend: number | null;
    totalItem: number | null;
}