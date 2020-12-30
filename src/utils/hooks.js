function useDebounce(debounceTime, callback) {
    let debounceTimer = null;

    return (...args) => {
        debounceTimer && clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => callback(...args), debounceTime);
    };
}

export { useDebounce };
