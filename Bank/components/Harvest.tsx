import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { Contract } from 'ethers';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useEarnings from '../../../hooks/useEarnings';
import useHarvest from '../../../hooks/useHarvest';

import { getDisplayBalance } from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../basis-cash';

import Timelock from './TimelockPool';
import moment from 'moment';


interface HarvestProps {
  bank: Bank;
}

const Harvest: React.FC<HarvestProps> = ({ bank }) => {
  const earnings = useEarnings(bank.contract);
  const { onReward } = useHarvest(bank);

  const tokenName = bank.earnTokenName === 'XMS' ? 'Share' : 'Cash';

  let prevEpoch = '0';
  switch (bank?.sort) {
    case 1:
      prevEpoch = localStorage.getItem('prevDate1') || '0'
      break;
    case 2:
      prevEpoch = localStorage.getItem('prevDate2') || '0'
      break;
    case 5:
      prevEpoch = localStorage.getItem('prevDate5') || '0'
      break;
    case 11:
      prevEpoch = localStorage.getItem('prevDate11') || '0'
      break;
    default:
      prevEpoch = '0';
  }

  const nextEpoch = useMemo(() => moment(prevEpoch).add(24, 'h').toDate(), [prevEpoch]);
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
              <TokenSymbol symbol={bank.earnToken.symbol} />
            </CardIcon>
            <Value value={getDisplayBalance(earnings)} />
            <Label text={`XMAN ${tokenName} Earned`} />
          </StyledCardHeader>
          <Timelock
            deadline={nextEpoch}
            description="Unlock After"
          />
          <StyledCardActions>
            <Button onClick={onReward} disabled={earnings.eq(0) || isDisabled} text="Settle"  />
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
