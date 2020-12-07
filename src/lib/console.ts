import colors from 'colors';

export const success = (content: any) => {
    console.log(colors.green(content));
};

export const error = (content: any) => {
    console.log(colors.red(content));
};

export const warning = (content: any) => {
    console.log(colors.yellow(content));
};

export const info = (content: any) => {
    console.log(colors.gray(content));
};