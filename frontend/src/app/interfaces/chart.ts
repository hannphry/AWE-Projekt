import { ChartType } from "angular-google-charts"

export interface Chart{
    title: string,
    type: ChartType,
    columns: string[];
    values: any[],
    options: any
};