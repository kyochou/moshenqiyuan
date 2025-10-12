const SAFE_CHARSET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // 32 chars, uppercase

function encodePhone(phone) {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        throw new Error('Invalid Chinese phone number');
    }
    const suffix = phone.slice(1); // remove leading '1'
    let num = parseInt(suffix, 10);
    
    if (num === 0) return SAFE_CHARSET[0];
    
    let result = '';
    const base = SAFE_CHARSET.length; // 32
    
    while (num > 0) {
        result = SAFE_CHARSET[num % base] + result;
        num = Math.floor(num / base);
    }
    
    // Pad to 7 characters with first char ('2')
    return result.padStart(7, SAFE_CHARSET[0]);
}

function decodePhone(code) {
    const base = SAFE_CHARSET.length;
    let num = 0;
    
    // Accept uppercase input (convert to uppercase for safety)
    const upperCode = code.toUpperCase();
    
    for (let i = 0; i < upperCode.length; i++) {
        const char = upperCode[i];
        const idx = SAFE_CHARSET.indexOf(char);
        if (idx === -1) {
            throw new Error(`Invalid character: ${char}`);
        }
        num = num * base + idx;
    }
    
    if (num > 9999999999) {
        throw new Error('Decoded number exceeds phone range');
    }
    
    return '1' + num.toString().padStart(10, '0');
}

// Example usage:
// console.log(encodePhone("13812345678")); // e.g., "B9XK2M4"
// console.log(decodePhone("B9XK2M4"));     // "13812345678"