export interface CheckoutCity {
  name: string;
  department: string;
  cashOnDelivery: boolean;
}

export const checkoutMock = {
  freeShippingThreshold: 200_000,
  shippingFee: 12_000,
  cities: [
    { name: 'Bogotá', department: 'Bogotá D.C.', cashOnDelivery: true },
    { name: 'Medellín', department: 'Antioquia', cashOnDelivery: true },
    { name: 'Cali', department: 'Valle del Cauca', cashOnDelivery: true },
    { name: 'Barranquilla', department: 'Atlántico', cashOnDelivery: true },
    { name: 'Sibaté', department: 'Cundinamarca', cashOnDelivery: false }
  ] satisfies CheckoutCity[],
  paymentMethods: [
    { id: 'pse', label: 'PSE', description: 'Débito desde tu banco' },
    { id: 'card', label: 'Tarjeta débito o crédito', description: 'Visa y Mastercard' },
    { id: 'wallet', label: 'Nequi o Daviplata', description: 'Desde tu billetera digital' },
    { id: 'cash-on-delivery', label: 'Pago contra entrega', description: 'Disponible en ciudades seleccionadas' }
  ] as const
} as const;

export type PaymentMethodId = typeof checkoutMock.paymentMethods[number]['id'];