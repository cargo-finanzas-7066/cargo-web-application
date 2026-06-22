import { Client, Vehicle, FinancialEntity, Simulation, DashboardStats, RecentActivity, User } from './models';

export const MOCK_USER: User = { id: 1, name: 'Gabriela', email: 'gabriela@cargo.pe', role: 'Asesora financiera' };

export const MOCK_CLIENTS: Client[] = [
  { id: 1, docType: 'DNI', docNumber: '12345678', names: 'María', surnames: 'Torres García', email: 'maria@email.com', phone: '987654321', monthlyIncome: 3500, occupation: 'Ingeniera', status: 'Activo' },
  { id: 2, docType: 'DNI', docNumber: '87654321', names: 'Carlos', surnames: 'López Mendoza', email: 'carlos@email.com', phone: '912345678', monthlyIncome: 4200, occupation: 'Contador', status: 'Activo' },
  { id: 3, docType: 'CE', docNumber: 'A1234567', names: 'Ana', surnames: 'González Rivas', email: 'ana@email.com', phone: '998877665', monthlyIncome: 5000, occupation: 'Abogada', status: 'Activo' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 1, brand: 'Toyota', model: 'Yaris', year: 2025, category: 'Media', price: 68000, currency: 'PEN', dealer: 'Toyota del Perú', image: '', status: 'Disponible' },
  { id: 2, brand: 'Hyundai', model: 'Accent', year: 2025, category: 'Baja', price: 52000, currency: 'PEN', dealer: 'Hyundai Perú', image: '', status: 'Disponible' },
  { id: 3, brand: 'Kia', model: 'Sportage', year: 2024, category: 'Media', price: 85000, currency: 'PEN', dealer: 'Kia Perú', image: '', status: 'Disponible' },
  { id: 4, brand: 'Nissan', model: 'Sentra', year: 2025, category: 'Media', price: 72000, currency: 'PEN', dealer: 'Nissan Perú', image: '', status: 'Disponible' },
  { id: 5, brand: 'Toyota', model: 'Corolla', year: 2025, category: 'Alta', price: 95000, currency: 'PEN', dealer: 'Toyota del Perú', image: '', status: 'Disponible' },
  { id: 6, brand: 'Mitsubishi', model: 'Outlander', year: 2024, category: 'Alta', price: 110000, currency: 'PEN', dealer: 'Mitsubishi Perú', image: '', status: 'No disponible' },
];

export const MOCK_ENTITIES: FinancialEntity[] = [
  { id: 1, name: 'Banco de Crédito BCP', type: 'Banco', product: 'Crédito vehicular', tea: 13.5, minTerm: 12, maxTerm: 60, minDownPayment: 20, insuranceDisbursement: 0.05, insuranceVehicle: 3.5, monthlyFee: 10, adminCost: 150, penalties: '', status: 'Activo' },
  { id: 2, name: 'Interbank', type: 'Banco', product: 'Compra inteligente', tea: 14.2, minTerm: 12, maxTerm: 48, minDownPayment: 25, insuranceDisbursement: 0.04, insuranceVehicle: 3.2, monthlyFee: 8, adminCost: 100, penalties: '', status: 'Activo' },
  { id: 3, name: 'BBVA Perú', type: 'Banco', product: 'Crédito vehicular', tea: 12.8, minTerm: 12, maxTerm: 60, minDownPayment: 20, insuranceDisbursement: 0.05, insuranceVehicle: 3.0, monthlyFee: 12, adminCost: 180, penalties: '', status: 'Activo' },
  { id: 4, name: 'Scotiabank', type: 'Banco', product: 'Crédito vehicular', tea: 14.8, minTerm: 12, maxTerm: 48, minDownPayment: 30, insuranceDisbursement: 0.06, insuranceVehicle: 3.8, monthlyFee: 0, adminCost: 200, penalties: '', status: 'Activo' },
  { id: 5, name: 'Financiera Oh!', type: 'Financiera', product: 'Compra inteligente', tea: 16.5, minTerm: 12, maxTerm: 36, minDownPayment: 20, insuranceDisbursement: 0.08, insuranceVehicle: 4.0, monthlyFee: 15, adminCost: 120, penalties: '', status: 'Inactivo' },
];

export const MOCK_SIMULATIONS: Simulation[] = [
  { id: 1, code: 'SIM-0001', clientId: 1, vehicleId: 1, entityId: 1, currency: 'PEN', vehiclePrice: 68000, downPayment: 13600, financedAmount: 54400, term: 48, tea: 13.5, paymentDay: 5, disbursementDate: '2026-05-01', graceType: 'partial', graceMonths: 2, insuranceDisbursement: 0.05, insuranceVehicle: 3.5, monthlyFee: 10, adminCost: 150, notaryCost: 0, otherCharges: 0, status: 'Simulado', createdAt: '2026-05-05' },
  { id: 2, code: 'SIM-0002', clientId: 2, vehicleId: 2, entityId: 2, currency: 'PEN', vehiclePrice: 52000, downPayment: 13000, financedAmount: 39000, term: 36, tea: 14.2, paymentDay: 10, disbursementDate: '2026-05-10', graceType: 'none', graceMonths: 0, insuranceDisbursement: 0.04, insuranceVehicle: 3.2, monthlyFee: 8, adminCost: 100, notaryCost: 0, otherCharges: 0, status: 'Guardado', createdAt: '2026-05-10' },
];

export const MOCK_DASHBOARD: DashboardStats = {
  totalSimulations: 48, totalClients: 32, totalVehicles: 15, totalEntities: 8,
};

export const MOCK_RECENT: RecentActivity[] = [
  { client: 'María Torres', vehicle: 'Toyota Yaris', entity: 'BCP', amount: 58000, status: 'Simulado', date: '05/05/2026' },
  { client: 'Carlos López', vehicle: 'Hyundai Accent', entity: 'Interbank', amount: 39000, status: 'Guardado', date: '10/05/2026' },
  { client: 'Ana González', vehicle: 'Kia Sportage', entity: 'BBVA', amount: 72000, status: 'Aprobado', date: '28/04/2026' },
  { client: 'Pedro Ruiz', vehicle: 'Nissan Sentra', entity: 'Scotiabank', amount: 61000, status: 'Simulado', date: '15/04/2026' },
  { client: 'Lucía Ramos', vehicle: 'Toyota Corolla', entity: 'BCP', amount: 81000, status: 'Observado', date: '02/04/2026' },
];
