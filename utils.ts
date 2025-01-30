import { GraphQLError } from "graphql";
import { API_time } from "./type.ts";

const API_KEY = Deno.env.get("API_KEY");
console.log("API_KEY:", API_KEY); // Ver si la clave se está leyendo correctamente

export const getDatetime = async () => {
    if (!API_KEY) throw new GraphQLError("Error en la API_KEY");
    
    const url = `https://api.api-ninjas.com/v1/worldtime?timezone=Europe/Madrid`;
    console.log("Consultando API de tiempo con URL:", url);

    const data = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY,
        },
    });

    console.log("Código de respuesta de la API de tiempo:", data.status);

    if (data.status !== 200) {
        console.error("Error en API Ninjas (worldtime):", await data.text());
        throw new GraphQLError("Error en la API");
    }

    const result: API_time = await data.json();
    console.log("Respuesta de la API de tiempo:", result);
    
    return result.datetime;
};

export const validatePhoneNumber = async (phone: string): Promise<boolean> => {
    console.log("Validando número de teléfono:", phone);
    console.log("Usando API_KEY:", API_KEY); // Para ver si la clave está definida

    const url = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`;
    console.log("Consultando API de validación de teléfono con URL:", url);

    const response = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY!,
        },
    });

    console.log("Código de respuesta de la API de validación de teléfono:", response.status);

    // Mostrar detalles adicionales de la respuesta de la API
    const responseText = await response.text();
    console.log("Respuesta de la API:", responseText);

    if (response.status !== 200) {
        console.error("Error en API Ninjas (phone validation):", responseText);
        throw new GraphQLError("Error al validar el número de teléfono");
    }

    const result = JSON.parse(responseText);
    console.log("Respuesta procesada de la API de validación de teléfono:", result);

    if (!result.valid) {
        console.error("Número de teléfono no válido:", phone);
        throw new GraphQLError("Número de teléfono no válido");
    }

    return result.valid;
};



