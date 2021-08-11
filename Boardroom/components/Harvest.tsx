import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import TokenSymbol from '../../../components/TokenSymbol';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import CardIcon from '../../../components/CardIcon';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useBoardroomAllocationTimes from '../../../hooks/useBoardroomAllocationTimes';
import Timelock from './Timelock';
import moment from 'moment';


const Harvest: React.FC = ({}) => {
  const { onReward } = useHarvestFromBoardroom();
  const earnings = useEarningsOnBoardroom();
  
  const { prevClaimAllocation, nextClaimAllocation, period } = useBoardroomAllocationTimes();

  const prevEpoch = useMemo(
    () =>
      nextClaimAllocation.getTime() <= Date.now()
        ? prevClaimAllocation
        : prevClaimAllocation,
    [prevClaimAllocation, nextClaimAllocation],
  );

  const nextEpoch = useMemo(() => moment(prevEpoch).add(period, 's').toDate(), [prevEpoch]);
  let isDisabled = useMemo(
    () =>
        nextEpoch.getTime() > Date.now()
        ? true
        : false,
    [nextEpoch],
  );

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="XMC" />
            </CardIcon>
            <Value value={getDisplayBalance(earnings)} />
            <Label text="XMAN Cash Earned" />
          </StyledCardHeader>
          <Timelock
            deadline={nextEpoch}
            description="Unlock After"
          />
          <StyledCardActions>
            <Button onClick={onReward} text="Claim Reward" disabled={earnings.eq(0) || isDisabled} />
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Harvest;
