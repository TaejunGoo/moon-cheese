import { useCurrency } from '@/ui-lib/components/currency-context';

export const useTransCurrency = () => {
  const currency = useCurrency();

  return (value: number) => {
    if (!currency.exchangeRate) {
      return currency.currency === 'USD' ? `$${value.toLocaleString()}` : '환율 정보를 불러오지 못했습니다';
    }
    const USDValue = value;
    const KRWValue = value * currency.exchangeRate.KRW;

    return currency.currency === 'USD' ? `$${USDValue.toLocaleString()}` : `${Math.ceil(KRWValue).toLocaleString()}원`;
  };
};
