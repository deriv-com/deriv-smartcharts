import dayjs, { Dayjs } from 'dayjs';

export type TCalendarViewProps = {
    calendar_date: string;
    isPeriodDisabled: (date: Dayjs | string, unit: dayjs.OpUnitType) => boolean;
    selected_date: string;
    onClick: {
        date: (e: React.SyntheticEvent<HTMLElement>, is_disabled: boolean) => void;
        month: (e: React.SyntheticEvent<HTMLElement>) => void;
        year: (e: React.SyntheticEvent<HTMLElement>) => void;
        decade: (e: React.SyntheticEvent<HTMLElement>) => void;
    };
};
