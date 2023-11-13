import { Subject } from 'rxjs';

// https://netbasal.com/create-a-typed-version-of-simplechanges-in-angular-451f86593003

export type NgChanges<Component extends object, Props = ExcludeFunctions<Component>> = {
  [Key in keyof Props]: {
    previousValue: Props[Key];
    currentValue: Props[Key];
    firstChange: boolean;
    isFirstChange(): boolean;
  };
};
type MarkFunctionPropertyNames<Component> = {
  [Key in keyof Component]: Component[Key] extends Function | Subject<any> ? never : Key;
};

type ExcludeFunctionPropertyNames<T extends object> = MarkFunctionPropertyNames<T>[keyof T];

type ExcludeFunctions<T extends object> = Pick<T, ExcludeFunctionPropertyNames<T>>;
