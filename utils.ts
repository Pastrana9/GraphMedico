import { GraphQLError } from "graphql";

const API_KEY = Deno.env.get("API_KEY");

export const validatePhoneNumber = async (phone: string): Promise<boolean> => {
  const url = `https://api.api-ninjas.com/v1/phone?number=${phone}`;
  const response = await fetch(url, { headers: { 'X-Api-Key': API_KEY } });
  if (response.status !== 200) throw new GraphQLError("Error al validar el número");
  const result = await response.json();
  return result.valid;
};
