import { createContext, useContext, useEffect, useState } from 'react';
import type { CurrencyType } from './currency-toggle';
import { http } from '@/utils/http';

type ExchangeRate = {
  KRW: number;
  USD: number;
};

type CurrencyContextType = {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  exchangeRate: ExchangeRate | null;
  exchangeRateError: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [exchangeRateError, setExchangeRateError] = useState<boolean>(false);

  useEffect(() => {
    http
      .get<{ exchangeRate: ExchangeRate }>('/api/exchange-rate')
      .then(response => {
        setExchangeRate(response.exchangeRate);
      })
      .catch(error => {
        setExchangeRateError(true);
        setExchangeRate(null);
        console.error('Error fetching exchange rates:', error);
      });
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate, exchangeRateError }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
