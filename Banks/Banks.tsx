import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Bank from '../Bank';
import BankCards from './BankCards';
import { useWallet } from 'use-wallet';
import Button from '../../components/Button';
import styled from 'styled-components';
import LaunchCountdown from '../../components/LaunchCountdown';
import config from '../../config';


const Banks: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();
  const isLaunched = Date.now() >= config.bankLaunchesAt.getTime();


  if (!isLaunched) {
    return (
      <Switch>
        <Page>
          <PageHeader
            icon={'🏦'}
            title="Pick a Bank"
            subtitle="Earn XMAN Shares & XMAN Cash by providing liquidity"
          />
          <LaunchCountdown
            deadline={config.bankLaunchesAt}
            description=""
            descriptionLink=""
          />
        </Page>
      </Switch>
    );
  }
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <PageHeader
            icon={'🏦'}
            title="Pick a Bank"
            subtitle="Earn XMAN Shares & XMAN Cash by providing liquidity"
          />
          {!!account ? (
            <BankCards />
          ) : (
            <Center>
              <Button onClick={() => connect('injected')} text="Unlock Wallet" />
            </Center>
          )}
        </Route>
        <Route path={`${path}/:bankId`}>
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Banks;
