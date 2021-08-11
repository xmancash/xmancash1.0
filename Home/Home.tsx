import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import HomeCard from './components/HomeCard';
import { OverviewData } from './types';
import useBasisCash from '../../hooks/useBasisCash';
import config from '../../config';
import Notice from '../../components/Notice';

const Home: React.FC = () => {
  const basisCash = useBasisCash();

  const [{ cash, bond, share }, setStats] = useState<OverviewData>({});
  const fetchStats = useCallback(async () => {
    const [cash, bond, share] = await Promise.all([
      basisCash.getCashStatFromUniswap(),
      basisCash.getBondStat(),
      basisCash.getShareStat(),
    ]);
    if (Date.now() < config.bondLaunchesAt.getTime()) {
      bond.priceInDAI = '-';
    }
    setStats({ cash, bond, share });
  }, [basisCash, setStats]);

  useEffect(() => {
    if (basisCash) {
      fetchStats().catch((err) => console.error(err.stack));
    }
  }, [basisCash]);

  const cashAddr = useMemo(() => basisCash?.XMC.address, [basisCash]);
  const shareAddr = useMemo(() => basisCash?.XMS.address, [basisCash]);
  const bondAddr = useMemo(() => basisCash?.XMB.address, [basisCash]);

  return (
    <Page>
      {/* <StyledWord>
        <h3>Announcement:</h3>
        <p>XMAN Cash will launch at 15:00 PM, Hong Kong time.
The airdrop of snapshot will also be carried out ASAP.</p>
      </StyledWord> */}
      <PageHeader
        icon="👋"
        subtitle="Buy, sell, and provide liquidity for XMAN Cash and XMAN Shares"
        title="Welcome to XMAN Cash!"
      />
      <Spacer size="md" />
      <CardWrapper>
        <HomeCard
          title="XMAN Cash"
          symbol="XMC"
          color="#ffbe1b"
          supplyLabel="Circulating Supply"
          address={cashAddr}
          stat={cash}
        />
        <Spacer size="lg" />
        <HomeCard
          title="XMAN Share"
          symbol="XMS"
          color="#ffbe1b"
          address={shareAddr}
          stat={share}
        />
        <Spacer size="lg" />
        <HomeCard
          title="XMAN Bond"
          symbol="XMB"
          color="#ffbe1b"
          address={bondAddr}
          stat={bond}
        />
      </CardWrapper>
    </Page>
  );
};

const StyledOverview = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledNoticeContainer = styled.div`
  max-width: 768px;
  width: 90vw;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
`;

const StyledWord = styled.div`
  font-size: 24px;
  color: #ffbe1b;
  max-width: 768px;
  & h3 {
    text-align: center;
  }
  & p {
    color: #77d877;
  }
`
export default Home;
