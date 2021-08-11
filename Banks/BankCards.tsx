import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { Bank } from '../../basis-cash';
import Button from '../../components/Button';
import Card from '../../components/Card1';
import CardContent from '../../components/CardContent';
import CardIcon from '../../components/CardIcon';
import useBanks from '../../hooks/useBanks';
import TokenSymbol from '../../components/TokenSymbol';
import Notice from '../../components/Notice';
import cardborder from '../../assets/img/cardborder.png';
import Timelock from './Timelock';
import moment from 'moment';
import useGetApy from '../../hooks/useGetApy';

const BankCards: React.FC = () => {
  const [banks] = useBanks();

  const activeBanks = banks.filter((bank) => !bank.finished);
  const inactiveBanks = banks.filter((bank) => bank.finished);

  let finishedFirstRow = false;
  const inactiveRows = inactiveBanks.reduce<Bank[][]>(
    (bankRows, bank) => {
      const newBankRows = [...bankRows];
      if (newBankRows[newBankRows.length - 1].length === (finishedFirstRow ? 2 : 3)) {
        newBankRows.push([bank]);
        finishedFirstRow = true;
      } else {
        newBankRows[newBankRows.length - 1].push(bank);
      }
      return newBankRows;
    },
    [[]],
  );

  return (
    <StyledCards>
      {inactiveRows[0].length > 0 && (
        <StyledInactiveNoticeContainer>
          <Notice color="grey">
            <b>You have banks where the mining has finished.</b>
            <br />
            Please withdraw and settle your stakes.
          </Notice>
        </StyledInactiveNoticeContainer>
      )}
      <StyledRow>
        {activeBanks.map((bank, i) => (
          <React.Fragment key={bank.name}>
            <BankCard bank={bank} />
            {/* {i < activeBanks.length - 1 && <StyledSpacer />} */}
          </React.Fragment>
        ))}
      </StyledRow>
      {inactiveRows[0].length > 0 && (
        <>
          <StyledInactiveBankTitle>Inactive Banks</StyledInactiveBankTitle>
          {inactiveRows.map((bankRow, i) => (
            <StyledRow key={i}>
              {bankRow.map((bank, j) => (
                <React.Fragment key={j}>
                  <BankCard bank={bank} />
                  {/* {j < bankRow.length - 1 && <StyledSpacer />} */}
                </React.Fragment>
              ))}
            </StyledRow>
          ))}
        </>
      )}
    </StyledCards>
  );
};

interface BankCardProps {
  bank: Bank;
}

const BankCard: React.FC<BankCardProps> = ({ bank }) => {
  const { onePoolApy, twoPoolApy, bdoPoolApy, freeoPoolApy } = useGetApy();

  const POOL_START_DATE = Date.parse('2021-03-03T07:00:00Z');
  const prevEpoch = POOL_START_DATE;

  const nextEpoch = useMemo(() => moment(prevEpoch).add(5, 'day').toDate(), [prevEpoch]);
  let pool, timelock, apy;
  if (bank.depositTokenName.includes('LP') && bank.depositTokenName.includes('XMS_DAI')) {
    pool = <StyledCardSuperAccent />
  } else if (bank.depositTokenName.includes('LP') && bank.depositTokenName.includes('XMC_DAI')) {
    pool = <StyledCardAccent />
  } else {
    pool = <StyledCardOtherAccent />
  }
  if (bank?.sort === 3 || bank?.sort === 5 || bank?.sort === 11) {
    timelock = <Timelock
                deadline={nextEpoch}
                description=""
              />
  } else {
    timelock = ''
  }
  switch (bank?.sort) {
    case 1:
      apy = onePoolApy
      break;
    case 2:
      apy = twoPoolApy
      break;
    case 5:
      apy = bdoPoolApy
      break;
    case 11:
      apy = freeoPoolApy
      break;
    default:
      apy = 0;
  }
  return (
    <StyledCardWrapper>
      {pool}
      <Card>
        <CardContent>
          <StyledContent>
            <StyledTitle>{bank.name}</StyledTitle>
            <CardIcon>
              <TokenSymbol symbol={bank.depositTokenName} size={80} />
            </CardIcon>
            <StyledTimelock>
              {timelock}
            </StyledTimelock>
            <StyledDetails>
              <StyledDetail>APY: {`${(apy * 100 * 365).toFixed(2)}`} %</StyledDetail>
              <StyledDetail>Daily Return : {`${(apy * 100 ).toFixed(2)}`} %</StyledDetail>
              <StyledDetail>Deposit {bank.depositTokenName.toUpperCase()}</StyledDetail>
              <StyledDetail>Earn {`${bank.earnTokenName}`}</StyledDetail>
            </StyledDetails>
            <Button text="Select" to={`/bank/${bank.contract}`} />
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  );
};

const StyledTimelock = styled.div`
  height: 60px;
`;

const StyledCardAccent = styled.div`
  background-image: url(${cardborder});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`;

const StyledCardSuperAccent = styled.div`
  background-image: url(${cardborder});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  z-index: -1;
`;

const StyledCardOtherAccent = styled.div`
  background-image: url(${cardborder});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`;

const StyledCards = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1050px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((950px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
  margin-bottom: 30px;
  margin-left: ${(props) => props.theme.spacing[5]}px;
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[200]};
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0 0 10px;
  height: 52px;
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  & img {
    margin-top: 25px;
  }
  & button {
    background: #424242;
  }
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDetails = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  margin-top: 55px;
  text-align: center;
`;

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[300]};
`;

const StyledInactiveNoticeContainer = styled.div`
  width: 598px;
  margin-bottom: ${(props) => props.theme.spacing[6]}px;
`;

const StyledInactiveBankTitle = styled.p`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.color.grey[400]};
  margin-top: ${(props) => props.theme.spacing[5]}px;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`;

export default BankCards;
