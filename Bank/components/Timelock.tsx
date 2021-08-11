import React from 'react';
import styled from 'styled-components';
import Countdown, { CountdownRenderProps } from 'react-countdown';

interface ProgressCountdownProps {
  deadline: Date;
  description: string;
}

const ProgressCountdown: React.FC<ProgressCountdownProps> = ({
  deadline,
  description,
}) => {

  const countdownRenderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds } = countdownProps;
    const h = String(days * 24 + hours);
    const m = String(minutes);
    const s = String(seconds);
    return (
      <StyledCountdown>
        In {days} day {hours} hour {m.padStart(2, '0')} min {s.padStart(2, '0')} s
      </StyledCountdown>
    );
  };
  return (
    <div>
      <StyledCardContentInner>
        <StyledDesc>{description}</StyledDesc>
        <Countdown date={deadline} renderer={countdownRenderer} autoStart={true}/>
      </StyledCardContentInner>
    </div>
  );
};

const StyledCountdown = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.color.grey[100]};
  margin: 0 0 6px 0;
`;

const StyledProgressOuter = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 3px;
  background: ${(props) => props.theme.color.grey[700]};
`;

const StyledProgress = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  border-radius: 3px;
  background: ${(props) => props.theme.color.grey[100]};
`;

const StyledDesc = styled.span`
  color: ${(props) => props.theme.color.grey[500]};
  font-weight: 700;
  font-size: 12px;
  text-align: center;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[2]}px 0;
`;

export default ProgressCountdown;
