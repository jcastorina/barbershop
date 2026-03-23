declare global {
  type Employee = string[];
  type DayKey = `day${number}`;
  type AppointmentDay = "Today" | DayKey;
  type DayAvailability = string[] | null;

  type IClientObject = {
    barbers: {
      [barber: string]: Record<DayKey, DayAvailability>;
    };

    token: string;
  };

  type IDay = DayKey;
  type IDays = DayKey[];

  type IAppointmentRecord = {
    name: string;
    time: string;
    barber: string;
    day: AppointmentDay | string;
    phone: string;
    token: string;
  };

  type IDaySchedule = {
    hours: number[] | null;
    appts: IAppointmentRecord[] | never[];
  };

  type ISchedule = Record<DayKey, IDaySchedule>;

  type IMode = "loading" | "form" | "success" | "conflict" | "already";

  type FastOmit<T extends object, U extends string | number | symbol> = {
    [K in keyof T as K extends U ? never : K]: T[K];
  };
}

export {};
