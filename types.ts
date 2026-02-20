
export enum TransportType {
  TAXI = 'TAXI',
  MOTO = 'MOTO',
  TRICYCLE = 'TRICYCLE',
  MINIBUS = 'MINIBUS',
  DELIVERY_MOTO = 'DELIVERY_MOTO',
  DELIVERY_CAR = 'DELIVERY_CAR',
  CLANDO = 'CLANDO',
  QUARTIER_MAISON = 'QUARTIER_MAISON'
}

export type SubscriptionTier = 'FREE' | 'PREMIUM';
export type UserRole = 'CLIENT' | 'DRIVER' | 'ARTISAN' | 'MERCHANT' | 'DELIVERY' | 'DOCTOR' | 'PHARMACY';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: UserRole;
  phone?: string;
}

export type OrderStatus = 'PENDING_DELIVERY' | 'PICKED_UP' | 'DELIVERED' | 'IN_OBSERVATION' | 'COMPLETED' | 'RECEIVED';

export interface Pharmacy {
  id: string;
  name: string;
  neighborhood: string;
  phone: string;
  isOpen24h: boolean;
  isVerified: boolean;
  rating: number;
}

export interface Medication {
  id: string;
  name: string;
  price: number;
  needsPrescription: boolean;
  category: string;
}

export interface PharmacyOrder {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  medications: { name: string, price: number }[];
  prescriptionImage?: string;
  totalPrice: number;
  deliveryFee: number;
  status: 'WAITING_PHARMACIST' | 'APPROVED' | 'REJECTED' | 'IN_DELIVERY' | 'COMPLETED';
}

export interface MarketplaceOrder {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  deliveryFee: number;
  totalPrice: number;
  merchantId: string;
  merchantName: string;
  merchantNeighborhood: string;
  clientName: string;
  clientNeighborhood: string;
  livreurId?: string;
  livreurName?: string;
  status: OrderStatus;
  timestamp: number;
}

export type ArtisanCategory = 'plomberie' | 'electricite' | 'froid' | 'maconnerie' | 'menuiserie' | 'mecanique' | 'carrelage' | 'menage' | 'nettoyage' | 'charpenterie' | 'elagage';

export interface Artisan {
  id: string;
  name: string;
  job: string;
  category: ArtisanCategory;
  rating: number;
  distance: number;
  isVerified: boolean;
  avatar: string;
  completedTasks: number;
  yearsOnPlatform?: number;
  phone?: string;
  neighborhood?: string;
  balance?: number;
  pendingBalance?: number;
}

export interface Driver {
  id: string;
  name: string;
  type: TransportType;
  rating: number;
  distance: number;
  location: { lat: number; lng: number };
  currentDestination?: string;
}

export interface DriverRegistration {
  firstName: string;
  lastName: string;
  vehicleType: TransportType;
  seats: number;
  hasAC: boolean;
  plate: string;
  color: string;
  nsNumber?: string;
}

export interface ArtisanRegistration {
  firstName: string;
  lastName: string;
  job: string;
  category: ArtisanCategory;
  phone: string;
  neighborhood: string;
  avatar: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  category: 'generaliste' | 'pediatre' | 'gynecologue' | 'dentiste' | 'ophtalmo' | 'urologue' | 'diabetologue' | 'urgence';
  rating: number;
  distance: number;
  isVerified: boolean;
  avatar: string;
  neighborhood: string;
  experience: number;
  availability: 'disponible' | 'occupe' | 'urgence_uniquement';
  licenseNumber?: string;
  balance?: number;
}

export interface Livreur {
  id: string;
  name: string;
  vehicleType: TransportType;
  basePrice: number;
  phone: string;
  neighborhood: string;
  availability: string[];
  rating: number;
  isVerified: boolean;
  balance?: number;
  pendingBalance?: number;
}

export interface DeliveryRegistration {
  firstName: string;
  lastName: string;
  phone: string;
  vehicleType: TransportType;
  basePrice: number;
  neighborhood: string;
  availability: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  merchantId: string;
}

export interface Merchant {
  id: string;
  ownerName: string;
  shopName: string;
  phone: string;
  neighborhood: string;
  category: string;
  rating: number;
  isVerified: boolean;
  products: Product[];
  balance?: number;
  pendingBalance?: number;
}

export interface MerchantRegistration {
  firstName: string;
  lastName: string;
  shopName: string;
  phone: string;
  neighborhood: string;
  category: string;
}

export interface ActiveRide {
  id: string;
  driverName: string;
  vehiclePlate: string;
  type: TransportType;
  startTime: number;
  destination: string;
  isLocationShared: boolean;
  price: number;
  status: 'IDLE' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'VALIDATED_BY_CLIENT' | 'VALIDATED_BY_DRIVER' | 'OBSERVATION';
  passengers?: number;
  hasLuggage?: boolean;
}

export type ViewState = 'login' | 'one-pager' | 'home' | 'booking' | 'maraude' | 'driver' | 'wallet' | 'sos' | 'ride-progress' | 'waiting-validation' | 'delivery' | 'driver-registration' | 'artisans' | 'artisan-registration' | 'subscription' | 'terms' | 'delivery-registration' | 'delivery-dashboard' | 'marketplace' | 'merchant-registration' | 'merchant-dashboard' | 'order-tracking' | 'order-checkout' | 'client-dashboard' | 'doctors' | 'artisan-dashboard' | 'doctor-dashboard' | 'role-selection' | 'pharmacies' | 'pharmacy-registration' | 'medication-order' | 'doctor-registration' | 'business-dashboard';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  isTrusted: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'DRIVER' | 'PASSENGER';
  text: string;
  timestamp: number;
}
