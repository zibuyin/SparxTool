async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function storeLargeNumber(key, value){
    if (typeof key !== 'string') {
        throw new Error("Key must be a string");
    }

    if (typeof value !== 'string') {
        throw new Error("Value must be a string");
    }

    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.error(`Error storing value: ${e}`);
    }
}

function readLargeNumber(key) {
    if (typeof key !== 'string') {
        throw new Error("Key must be a string");
    }

    try {
        const storedValue = localStorage.getItem(key);

        if (storedValue === null) {
            console.warn(`No value found for key: ${key}`);
            return null;
        }

        const parsedValue = parseInt(storedValue, 10);

        if (isNaN(parsedValue)) {
            console.warn(`Stored value for key "${key}" is not a valid number`);
            return null;
        }

        return parsedValue;
    } catch (e) {
        console.error(`Error fetching value: ${e}`);
        return null;
    }
}