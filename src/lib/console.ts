import colors from 'colors';

export const success = (txt: string) => {
    console.log(colors.green(txt));
};

export const error = (txt: string) => {
    console.log(colors.red(txt));
};

export const warning = (txt: string) => {
    console.log(colors.yellow(txt));
};

export const info = (txt: string) => {
    console.log(colors.gray(txt));
};