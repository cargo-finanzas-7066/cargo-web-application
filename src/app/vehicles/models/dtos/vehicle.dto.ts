export interface VehicleDto {
  id: number;
  code: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  price: number;
  currency: string;
  dealer: string;
  description?: string;
  imageUrl?: string;
  status: string;
}
