export interface CustomerDto {
  id: number;
  docType: string;
  docNumber: string;
  names: string;
  surnames: string;
  email: string;
  phone: string;
  address?: string;
  monthlyIncome?: number;
  occupation?: string;
  status: string;
}
