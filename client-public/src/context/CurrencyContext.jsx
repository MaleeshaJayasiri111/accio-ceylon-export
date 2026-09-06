import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext(null);

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£)', flag: '🇬🇧' },
  LKR: { code: 'LKR', symbol: 'Rs.', rate: 302.5, label: 'LKR (Rs)', flag: '🇱🇰' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, label: 'AED (د.إ)', flag: '🇦🇪' }
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');

  const currentCurrency = CURRENCIES[currency] || CURRENCIES.USD;

  const convertPrice = (usdAmount) => {
    return Number((usdAmount * currentCurrency.rate).toFixed(2));
  };

  const formatPrice = (usdAmount) => {
    const val = convertPrice(usdAmount);
    if (currency === 'LKR') {
      return `Rs. ${Math.round(val).toLocaleString()}`;
    }
    return `${currentCurrency.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currentCurrency, convertPrice, formatPrice, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
