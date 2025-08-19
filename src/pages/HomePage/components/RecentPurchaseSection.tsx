import { Flex, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { useEffect, useState } from 'react';
import { http } from '@/utils/http';
import { useTransCurrency } from '@/utils/trans-currency';
import ErrorSection from '@/components/ErrorSection';

type RecentPurchase = {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
};

type RecentPurchaseResponse = {
  recentProducts: RecentPurchase[];
};

function RecentPurchaseSection() {
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [error, setError] = useState<boolean>(false);
  const transCurrency = useTransCurrency();
  const fetchData = () => {
    setError(false);
    http
      .get<RecentPurchaseResponse>('/api/recent/product/list')
      .then(response => {
        setRecentPurchases(response.recentProducts);
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>
      <Spacing size={4} />
      {error ? (
        <ErrorSection onRetry={fetchData} />
      ) : (
        <Flex
          css={{
            bg: 'background.01_white',
            px: 5,
            py: 4,
            gap: 4,
            rounded: '2xl',
          }}
          direction={'column'}
        >
          {recentPurchases.map(item => (
            <Flex key={item.id} css={{ gap: 4 }}>
              <styled.img
                src={item.thumbnail}
                alt={item.name}
                css={{
                  w: '60px',
                  h: '60px',
                  objectFit: 'cover',
                  rounded: 'xl',
                }}
              />
              <Flex flexDir="column" gap={1}>
                <Text variant="B2_Medium">{item.name}</Text>
                <Text variant="H1_Bold">{transCurrency(item.price)}</Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </styled.section>
  );
}

export default RecentPurchaseSection;
