import { useRef } from "react";

function useDebounce(debounceTime, callback) {
    const debounceTimer = useRef(null);

    return (...args) => {
        debounceTimer && clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(
            () => callback(...args),
            debounceTime
        );
    };
}

export { useDebounce };
