/* eslint-disable react/react-in-jsx-scope */
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon } from './Icons';
import { Toggle } from './Form';
import Tooltip from './Tooltip';

type TCrosshairToggleProps = {
    isVisible?: boolean;
};

const CrosshairToggle = ({ isVisible = true }: TCrosshairToggleProps) => {
    const { crosshair, chart } = useStores();
    const { setCrosshairState } = crosshair;
    const { isMobile } = chart;

    const state = typeof crosshair.state !== 'number' ? 0 : crosshair.state;

    const CrosshairIcon = [CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon][state];

    const labels = [
        t.translate("Don't show price info on chart"),
        t.translate('Show price info on x & y axes'),
        t.translate('Show price info on chart'),
    ];

    const onCrosshairToggle = () => {
        setCrosshairState((state + 1) % 3);
    };

    if (!isVisible) return null;

    return (
        <Tooltip content={labels[state]} enabled={!isMobile} position='right'>
            <Toggle active={state !== 0} onChange={onCrosshairToggle}>
                <CrosshairIcon />
            </Toggle>
        </Tooltip>
    );
};

export default observer(CrosshairToggle);
