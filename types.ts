import { OptionalId } from "mongodb";

export type PatientModel = OptionalId<{
  name: string;
  phone: string;
  email: string;
}>;

export type AppointmentModel = OptionalId<{
  patientId: string;
  datetime: string;
  type: string;
}>;
