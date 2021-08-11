import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../basis-cash';
import { currentDeployJson, buyurl } from '../../config';
import Timelock from './components/Timelock';
import moment from 'moment';

const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));

  const { bankId } = useParams();
  const bank = useBank(bankId);

  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);

  const POOL_START_DATE = Date.parse('2021-03-03T07:00:00Z');
  const prevEpoch = POOL_START_DATE;

  const nextEpoch = useMemo(() => moment(prevEpoch).add(5, 'day').toDate(), [prevEpoch]);
  let timelock;
  if (bank?.sort === 3 || bank?.sort === 5 || bank?.sort === 11) {
    timelock = <Timelock
                deadline={nextEpoch}
                description=""
              />
  } else {
    timelock = ''
  }

  let prevEpoch1 = '0';
  switch (bank?.sort) {
    case 1:
      prevEpoch1 = localStorage.getItem('prevDate1') || '0'
      break;
    case 2:
      prevEpoch1 = localStorage.getItem('prevDate2') || '0'
      break;
    case 5:
      prevEpoch1 = localStorage.getItem('prevDate5') || '0'
      break;
    case 11:
      prevEpoch1 = localStorage.getItem('prevDate11') || '0'
      break;
    default:
      prevEpoch1 = '0';
  }

  const nextEpoch1 = useMemo(() => moment(prevEpoch1).add(72, 'h').toDate(), [prevEpoch1]);
  let isDisabled = useMemo(
    () =>
        nextEpoch1.getTime() > Date.now()
        ? true
        : false,
    [nextEpoch1],
  );
  return account && bank ? (
    <>
      <PageHeader
        icon="🏦"
        subtitle={`Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`}
        title={bank?.name}
      />
      {timelock}
      <StyledBank>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <Harvest bank={bank} />
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <Stake bank={bank} />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
        {bank.depositTokenName.includes('LP') && <LPTokenHelpText bank={bank} />}
        <Spacer size="lg" />
        <div>
          <Button disabled={isDisabled} onClick={onRedeem} text="Settle & Withdraw" />
        </div>
        <Spacer size="lg" />
      </StyledBank>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  let pairName: string;
  let uniswapUrl: string;
  if (bank.depositTokenName.includes('XMC')) {
    pairName = 'XMC-USDT pair';
    uniswapUrl = `${buyurl}/#/add/${currentDeployJson.Cash.address}/${currentDeployJson.MockDai.address}`;
    // uniswapUrl = 'https://app.uniswap.org/#/add/0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a/0x6B175474E89094C44Da98b954EedeAC495271d0F';
  } else {
    pairName = 'XMS-USDT pair';
    uniswapUrl = `${buyurl}/#/add/${currentDeployJson.Share.address}/${currentDeployJson.MockDai.address}`;
    // uniswapUrl = 'https://app.uniswap.org/#/add/0xa7ED29B253D8B4E3109ce07c80fc570f81B63696/0x6B175474E89094C44Da98b954EedeAC495271d0F';
  }
  return (
    <StyledLink href={uniswapUrl} target="_blank">
      <img src="https://cdn.jsdelivr.net/gh/mdexSwap/hswap@main/favicon.png" alt="mdex"/>
      {` Provide liquidity to ${pairName} on Mdex `}
      <img src="https://cdn.jsdelivr.net/gh/mdexSwap/hswap@main/favicon.png" alt="mdex"/>
    </StyledLink>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader
        icon="🏚"
        title="Not Found"
        subtitle="You've hit a bank just robbed by unicorns."
      />
    </Center>
  );
};

const UnlockWallet = () => {
  const { connect } = useWallet();
  return (
    <Center>
      <Button onClick={() => connect('injected')} text="Unlock Wallet" />
    </Center>
  );
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledUniswapLPGuide = styled.div`
  margin: -24px auto 48px;
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
  & img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
  @media (max-width: 768px) {
    & img {
      display: none;
    }
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Bank;
