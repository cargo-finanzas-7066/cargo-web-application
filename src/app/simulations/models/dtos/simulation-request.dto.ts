export type GraceType = 'NONE' | 'PARTIAL' | 'TOTAL';

export interface SimulationRequestDto {
  clientId: number;
  vehicleId: number;
  financialProductId: number;
  vehiclePrice?: number;
  teaPercent?: number;
  downPaymentPercent: number;
  termMonths: number;
  cokTeaPercent: number;
  firstPaymentDate: string;
  paymentDay: number;
  graceType: GraceType;
  graceMonths: number;
  balloonPercent: number;
  creditLifeInsuranceEnabled: boolean;
  creditLifeInsuranceMonthlyPercent?: number;
  vehicleInsuranceEnabled: boolean;
  vehicleInsuranceAnnualPercent?: number;
}
