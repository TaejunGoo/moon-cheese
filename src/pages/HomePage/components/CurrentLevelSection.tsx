import { Box, Flex, styled } from 'styled-system/jsx';
import { ProgressBar, Spacing, Text } from '@/ui-lib';
import { useEffect, useState } from 'react';
import { http } from '@/utils/http';
import ErrorSection from '@/components/ErrorSection';

export type GradeType = 'EXPLORER' | 'PILOT' | 'COMMANDER';

export type MyType = {
  point: number;
  grade: GradeType;
};

export type PointType = {
  type: GradeType;
  minPoint: number;
};

function CurrentLevelSection() {
  const [myData, setMyData] = useState<MyType | null>(null);
  const [pointData, setPointData] = useState<PointType[] | null>(null);
  const [nextGradePoint, setNextGradePoint] = useState<number | string>('최고 등급');
  const [error, setError] = useState<boolean>(false);

  const fetchData = () => {
    setError(false);
    http
      .get<MyType>('/api/me')
      .then(res => {
        setMyData(res);
      })
      .catch(() => {
        setError(true);
      });

    http
      .get<{ gradePointList: PointType[] }>('/api/grade/point')
      .then(res => {
        setPointData(res.gradePointList);
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getToNextGradePoint = () => {
      if (!myData || !pointData) return 0;
      const gradeOrder: GradeType[] = ['EXPLORER', 'PILOT', 'COMMANDER'];
      const currentGradeIndex = gradeOrder.indexOf(myData.grade);
      const nextGrade = gradeOrder[currentGradeIndex + 1];
      const nextGradePoint = pointData.find(item => item.type === nextGrade)?.minPoint;
      setNextGradePoint(nextGradePoint ? nextGradePoint : '최고 등급');
    };

    getToNextGradePoint();
  }, [myData, pointData]);

  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />
      {error ? (
        <ErrorSection onRetry={fetchData} />
      ) : (
        <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
          <Flex flexDir="column" gap={2}>
            <Text variant="H2_Bold">Explorer</Text>
            <ProgressBar
              value={typeof nextGradePoint === 'number' && myData ? myData.point / nextGradePoint : 0}
              size="xs"
            />

            <Flex justifyContent="space-between">
              <Box textAlign="left">
                <Text variant="C1_Bold">현재 포인트</Text>
                <Text variant="C2_Regular" color="neutral.03_gray">
                  {myData?.point}P
                </Text>
              </Box>
              <Box textAlign="right">
                <Text variant="C1_Bold">다음 등급까지</Text>
                <Text variant="C2_Regular" color="neutral.03_gray">
                  {typeof nextGradePoint === 'number' && myData ? `${nextGradePoint - myData.point}P` : nextGradePoint}
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      )}
    </styled.section>
  );
}

export default CurrentLevelSection;
