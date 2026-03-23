

export function isEmailValid(emailValue) {
    const en = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return en.test(emailValue.trim());
}

