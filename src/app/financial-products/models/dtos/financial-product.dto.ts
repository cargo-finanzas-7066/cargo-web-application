export interface FinancialProductDto {
  id: number;
  financialInstitutionId: number;
  productName: string;
  currency: string;
  teaPercent: number;
  minTermMonths: number;
  maxTermMonths: number;
  minDownPaymentPercent: number;
  maxDownPaymentPercent: number;
  balloonAllowed: boolean;
  maxBalloonPercent: number;
  creditLifeInsuranceMonthlyPercent: number;
  vehicleInsuranceAnnualPercent: number;
  monthlyFee: number;
  adminCost: number;
  notaryCost: number;
  otherUpfrontCost: number;
  capitalizeInterestTotalGrace: boolean;
  capitalizeInsuranceTotalGrace: boolean;
  validFrom: string;
  validUntil: string | null;
  active?: boolean;
  version?: number;
}
