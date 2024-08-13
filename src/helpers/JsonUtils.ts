export const toLowerCaseValues = (
    obj: Record<string, any>
):Record<string, any> => {
    const result: Record<string, any> = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'string') {
                result[key] = value.toLowerCase();
            } else if (typeof value === 'object' && value !== null) {
                result[key] = toLowerCaseValues(value);
            } else {
                result[key] = value;
            }
        }
    }
    return result;
}

