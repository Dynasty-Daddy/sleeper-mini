import moment from 'moment-timezone';
import he from 'he';
import { useReducer } from 'react';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export default class _u {
    // Source: https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/core/shallowEqual.js
    static is(x, y) {
        // SameValue algorithm
        if (x === y) {
            // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            // Added the nonzero y check to make Flow happy, but it is redundant
            return x !== 0 || y !== 0 || 1 / x === 1 / y;
        } else {
            // Step 6.a: NaN == NaN
            // eslint-disable-next-line no-self-compare
            return x !== x && y !== y;
        }
    }

    // Source: https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/core/shallowEqual.js
    static shallowEqual(objA, objB) {
        if (_u.is(objA, objB)) {
            return true;
        }

        if (
            typeof objA !== 'object' ||
            objA === null ||
            typeof objB !== 'object' ||
            objB === null
        ) {
            return false;
        }

        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        // Test for A's keys different from B.
        for (let i = 0; i < keysA.length; i++) {
            if (
                !hasOwnProperty.call(objB, keysA[i]) ||
                !_u.is(objA[keysA[i]], objB[keysA[i]])
            ) {
                return false;
            }
        }

        return true;
    }
}

export const removeEmbedTokenBrackets = str => {
    let res = str.replace(/\<|\>/g, '');
    return res;
};

export const formatTimeSinceWithDayOfWeek = dt => {
    const now = moment();
    const date = moment(dt);
    const diff = now.diff(date, 'days');

    if (diff < 7) {
        return date.format('ddd');
    }

    return date.format('MMM D');
};

const reducer = (prevState, updater) => {
    const newState =
        typeof updater === 'function'
            ? { ...prevState, ...updater(prevState) }
            : { ...prevState, ...updater };

    if (_u.shallowEqual(prevState, newState)) {
        return prevState;
    } else {
        return newState;
    }
};

export const useMergeState = <S,>(initialState: S) =>
    useReducer<
        (prevState: S, updater: ((state: S) => Partial<S>) | Partial<S>) => S
    >(reducer, initialState);
