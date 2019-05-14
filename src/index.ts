export interface SimpleChange<T> {
    firstChange: boolean;
    previousValue: T;
    currentValue: T;
    isFirstChange: () => boolean;
}

export function OnChange<T = any>(callback: (value: T, simpleChange?: SimpleChange<T>) => void | T) {
    const cachedValueKey = Symbol();
    const isFirstChangeKey = Symbol();
    return (target: any, key: PropertyKey) => {
        Object.defineProperty(target, key, {
            set: function (value) {
                // change status of "isFirstChange"
                if (this[isFirstChangeKey] === undefined) {
                    this[isFirstChangeKey] = true;
                } else {
                    this[isFirstChangeKey] = false;
                }
                // No operation if new value is same as old value
                if (!this[isFirstChangeKey] && this[cachedValueKey] === value) {
                    return;
                }
                const oldValue = this[cachedValueKey];
                const simpleChange: SimpleChange<T> = {
                    firstChange: this[isFirstChangeKey],
                    previousValue: oldValue,
                    currentValue: value,
                    isFirstChange: () => this[isFirstChangeKey],
                };
                this[cachedValueKey] = callback.call(this, this[cachedValueKey], simpleChange) || value;
            },
            get: function () {
                return this[cachedValueKey];
            },
        });
    };
}
