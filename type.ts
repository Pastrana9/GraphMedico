import { OptionalId } from "mongodb";

export type ContactModel = OptionalId<{
    name: string;
    phone: string;
    country: string;
}>;

export type API_ip = {
    is_valid: boolean;
    country: string;
    timezone: string;
};

export type API_time = {
    datetime: string;
};

