export type GraceType = 'NONE' | 'PARTIAL' | 'TOTAL';

export interface SimulationRequestDto {
  clientId: number;
  vehicleId: number;
  financialProductId: number;
  vehiclePrice?: number;
  downPaymentPercent: number;
  termMonths: number;
  firstPaymentDate: string;
  paymentDay: number;
  graceType: GraceType;
  graceMonths: number;
  balloonPercent: number;
}
