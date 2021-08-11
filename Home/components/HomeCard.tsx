import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import Label from '../../../components/Label';
import { TokenStat } from '../../../basis-cash/types';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import TokenSymbol from '../../../components/TokenSymbol';
import { commify } from 'ethers/lib/utils';
import config from '../../../config';
import cardborder from '../../../assets/img/cardborder.png';

interface HomeCardProps {
  title: string;
  symbol: string;
  color: string;
  supplyLabel?: string;
  address: string;
  stat?: TokenStat;
}

const HomeCard: React.FC<HomeCardProps> = ({
  title,
  symbol,
  color,
  address,
  supplyLabel = 'Total Supply',
  stat,
}) => {
  const tokenUrl = `${config.etherscanUrl}/token/${address}`;
  return (
    <Wrapper>
      <StyledCards>
        <CardHeader>{title}</CardHeader>
        <TokenSymbol symbol={symbol} />
        <CardSection>
          {stat ? (
            <StyledValue>{(stat.priceInDAI !== '-' ? '$' : '') + stat.priceInDAI}</StyledValue>
          ) : (
            <ValueSkeleton />
          )}
          <Label text="Current Price" color={color} />
        </CardSection>

        <CardSection>
          {stat ? <StyledValue>{commify(stat.totalSupply)}</StyledValue> : <ValueSkeleton />}
          <StyledSupplyLabel href={tokenUrl} target="_blank" color={color}>
            {supplyLabel}
          </StyledSupplyLabel>
        </CardSection>
      </StyledCards>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  @media (max-width: 768px) {
    margin-top: ${(props) => props.theme.spacing[4]}px;
  }
`;

const CardHeader = styled.h2`
  color: #fff;
  text-align: center;
`;

const StyledCards = styled.div`
  min-width: 270px;
  padding: ${(props) => props.theme.spacing[3]}px;
  color: ${(props) => props.theme.color.white};
  background-image: url(${cardborder});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;
  &>img {
    margin-top: 20px;
  }
`;

const StyledValue = styled.span`
  display: inline-block;
  font-size: 26px;
  color: #eeeeee;
`;

const CardSection = styled.div`
  margin-top: 60px;

  &:last-child {
    margin-top: 10px;
    padding-bottom: 30px;
  }
`;

const ValueSkeletonPadding = styled.div`
  padding-top: ${(props) => props.theme.spacing[3]}px;
  padding-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledSupplyLabel = styled.a`
  display: block;
  color: ${(props) => props.color};
`;

const ValueSkeleton = () => {
  const theme = useContext(ThemeContext);
  return (
    <SkeletonTheme color={theme.color.grey[700]} highlightColor={theme.color.grey[600]}>
      <ValueSkeletonPadding>
        <Skeleton height={10} />
      </ValueSkeletonPadding>
    </SkeletonTheme>
  );
};

const GuideText = styled.span`
  color: ${(props) => props.theme.color.primary.main};
  font-size: 0.8rem;
`;

const ValueText = styled.p`
  color: ${(props) => props.theme.color.white};
  font-weight: bold;
  font-size: 1.25rem;
  margin: ${(props) => props.theme.spacing[1]}px 0;
`;

export default HomeCard;
