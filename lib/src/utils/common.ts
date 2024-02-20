import {
    Maybe,
    breakFormat,
    isDefined,
    isFalsyString,
    isNotDefined,
    isTruthyString,
    populateFormat,
    sum,
} from '@togglecorp/fujs';
import { DEFAULT_DATE_FORMAT } from './constants';

export type UnsafeNumberList = Maybe<Maybe<number>[]>;

function getMaximumFractionDigits(value: number) {
    if (value < 1000) {
        return 2;
    }

    const formatter = new Intl.NumberFormat('default', { notation: 'compact' });
    const formattedParts = formatter.formatToParts(value);
    const fraction = formattedParts.find(({ type }) => type === 'fraction');

    if (isNotDefined(fraction) || isFalsyString(fraction.value)) {
        return 0;
    }

    if (Number(fraction.value) > 0.1) {
        return 1;
    }

    return 0;
}

function getNumberListSafe(list: UnsafeNumberList) {
    if (isNotDefined(list)) {
        return undefined;
    }

    const safeList = list.filter(isDefined);

    if (safeList.length === 0) {
        return undefined;
    }

    return safeList;
}

export function sumSafe(list: UnsafeNumberList) {
    const safeList = getNumberListSafe(list);
    if (isNotDefined(safeList)) {
        return undefined;
    }

    return sum(safeList);
}

export function maxSafe(list: UnsafeNumberList) {
    const safeList = getNumberListSafe(list);
    if (isNotDefined(safeList)) {
        return undefined;
    }

    return Math.max(...safeList);
}

export function minSafe(list: UnsafeNumberList) {
    const safeList = getNumberListSafe(list);
    if (isNotDefined(safeList)) {
        return undefined;
    }

    return Math.min(...safeList);
}

export function avgSafe(list: UnsafeNumberList) {
    const safeList = getNumberListSafe(list);
    if (isNotDefined(safeList)) {
        return undefined;
    }

    const listSum = sum(safeList);
    return listSum / safeList.length;
}

interface FormatNumberOptions {
    currency?: boolean;
    unit?: Intl.NumberFormatOptions['unit'];
    maximumFractionDigits?: Intl.NumberFormatOptions['maximumFractionDigits'];
    compact?: boolean;
    separatorHidden?: boolean,
    language?: string,
}

export function formatNumber(
    value: null | undefined,
    options?: FormatNumberOptions,
): undefined
export function formatNumber(
    value: number | null | undefined,
    options?: FormatNumberOptions,
): undefined
export function formatNumber(
    value: number,
    options?: FormatNumberOptions,
): string
export function formatNumber(
    value: number | null | undefined,
    options?: FormatNumberOptions,
) {
    if (isNotDefined(value)) {
        return undefined;
    }

    const formattingOptions: Intl.NumberFormatOptions = {};

    if (isNotDefined(options)) {
        formattingOptions.maximumFractionDigits = getMaximumFractionDigits(value);
        return new Intl.NumberFormat('default', formattingOptions).format(value);
    }

    const {
        currency,
        unit,
        maximumFractionDigits,
        compact,
        separatorHidden,
        language,
    } = options;

    if (isTruthyString(unit)) {
        formattingOptions.unit = unit;
        formattingOptions.unitDisplay = 'short';
    }
    if (currency) {
        formattingOptions.currencyDisplay = 'narrowSymbol';
        formattingOptions.style = 'currency';
    }
    if (compact) {
        formattingOptions.notation = 'compact';
        formattingOptions.compactDisplay = 'short';
    }

    formattingOptions.useGrouping = !separatorHidden;

    if (isDefined(maximumFractionDigits)) {
        formattingOptions.maximumFractionDigits = maximumFractionDigits;
    } else {
        formattingOptions.maximumFractionDigits = getMaximumFractionDigits(value);
    }

    const newValue = new Intl.NumberFormat(language, formattingOptions)
        .format(value);

    return newValue;
}

export type DateLike = string | number | Date;

export function formatDate(
    value: DateLike | null | undefined,
    format = DEFAULT_DATE_FORMAT,
) {
    if (isNotDefined(value)) {
        return undefined;
    }

    const date = new Date(value);

    // Check if valid date
    if (Number.isNaN(date.getTime())) {
        return undefined;
    }

    const formattedValueList = populateFormat(breakFormat(format), date);
    // const formattedDate = formattedValueList.find((d) => d.type === 'date');

    const formattedDate = formattedValueList.map((valueItem) => valueItem.value).join('');

    // return formattedDate?.value;
    return formattedDate;
}

export function incrementDate(date: Date, days = 1) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

export function incrementMonth(date: Date, months = 1) {
    const newDate = new Date(date);
    newDate.setDate(1);
    newDate.setMonth(date.getMonth() + months);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

export function getNumberOfDays(start: Date, end: Date) {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    let numDays = 0;
    for (let i = startDate; i < endDate; i = incrementDate(i)) {
        numDays += 1;
    }

    return numDays;
}

export function getNumberOfMonths(start: Date, end: Date) {
    const monthDiff = Math.abs(
        ((12 * end.getFullYear()) + end.getMonth())
        - ((12 * start.getFullYear()) + start.getMonth()),
    );

    return monthDiff;
}

export function splitList<X, Y>(
    list: (X | Y)[],
    splitPointSelector: (item: X | Y, i: number) => item is X,
    includeBreakPointInResult = false,
): Y[][] {
    const breakpointIndices = list.map(
        (item, i) => (splitPointSelector(item, i) ? i : undefined),
    ).filter(isDefined);

    if (breakpointIndices.length === 0) {
        return [list as Y[]];
    }

    return [...breakpointIndices, list.length].map(
        (breakpointIndex, i) => {
            const prevIndex = i === 0
                ? 0
                : breakpointIndices[i - 1] + (includeBreakPointInResult ? 0 : 1);

            if (prevIndex === breakpointIndex) {
                return undefined;
            }

            const newList = list.slice(prevIndex, breakpointIndex);
            return newList as Y[];
        },
    ).filter(isDefined);
}
