export interface User {
  id: number; name: string; email: string; role: string; avatar?: string;
}
export interface Client {
  id: number; docType: string; docNumber: string; names: string;
  surnames: string; email: string; phone: string; address?: string;
  monthlyIncome?: number; occupation?: string; status: string;
}
export interface Vehicle {
  id: number; code?: string; brand: string; model: string; year: number;
  category: string; price: number; currency: string;
  dealer: string; description?: string; image?: string; imageUrl?: string; status: string;
}
export interface FinancialEntity {
  id: number; code?: string; shortName?: string; name: string; type: string; product: string;
  tea: number; minTerm: number; maxTerm: number;
  minDownPayment: number; insuranceDisbursement: number;
  insuranceVehicle: number; monthlyFee: number; adminCost: number;
  penalties?: string; status: string;
}
export interface Simulation {
  id: number; code: string; clientId: number; vehicleId: number;
  entityId: number; currency: string; vehiclePrice: number;
  downPayment: number; downPaymentPercent?: number; financedAmount: number; term: number;
  tea: number; tem?: number; paymentDay: number; disbursementDate: string;
  graceType: 'none' | 'total' | 'partial' | 'S' | 'T' | 'P'; graceMonths: number;
  balloonEnabled?: boolean; balloonAmount?: number;
  insuranceDisbursement: number; insuranceVehicle: number;
  monthlyFee: number; adminCost: number; notaryCost: number;
  otherCharges: number; monthlyPayment?: number; van?: number; tir?: number; tcea?: number;
  status: string; createdAt: string;
}
export interface SimulationResult {
  monthlyPayment: number; balloonAmount: number; tea: number; tem: number;
  van: number; tir: number; tcea: number;
  financedAmount: number; totalInterest: number; totalInsurance: number;
  totalCommissions: number; totalCreditCost: number; totalPayment: number;
  schedule: PaymentRow[];
}
export interface PaymentRow {
  period: number; date: string; initialBalance: number;
  payment: number; balloonPayment: number; interest: number; amortization: number;
  insurance: number; commission: number; totalPayment: number; finalBalance: number;
}
export interface DashboardStats {
  totalSimulations: number; totalClients: number;
  totalVehicles: number; totalEntities: number;
}
export interface RecentActivity {
  client: string; vehicle: string; entity: string;
  amount: number; status: string; date: string;
}
