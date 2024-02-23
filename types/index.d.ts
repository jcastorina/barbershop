declare global {
  type Employee = string[];

  type IClientObject = {
    barbers: {
      [barber: string]: {
        day0: string[] | null;
        day1: string[] | null;
      };
    };

    token: string;
  };

  type IDay = "day0" | "day1";
  type IDays = ["day0", "day1"];

  type IMode = "loading" | "form" | "success" | "conflict" | "already";

  type FastOmit<T extends object, U extends string | number | symbol> = {
    [K in keyof T as K extends U ? never : K]: T[K];
  };
}

export {};
