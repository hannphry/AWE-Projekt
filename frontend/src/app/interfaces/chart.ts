import { ChartType } from "angular-google-charts"

export interface Chart{
    title: string,
    type: ChartType,
    columns: any[];
    values: any[],
    options: any
};