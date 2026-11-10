/**
 * getWeather.ts – chat tool: demo weather lookup
 * Example of a parameterised AI SDK tool (accepts a `city` argument). It is
 * a mock: it returns a random condition after a simulated delay, and it is
 * not registered in route.ts.
 */

import { tool } from "ai";
import { z } from "zod";

/**
 * getWeather – parameterised demo tool: takes a city and returns one random
 * weather condition.
 * Input: `{ city }`; Output: a single string such as "sunny". The 3-second
 * delay simulates network latency so the chat UI's pending-tool state can be
 * observed; no external API is called.
 */
export const getWeather = tool({
  description:
    "show the weather in a given city to the user",
  parameters: z.object({
    city: z.string().describe("The city to get weather for"),
  }),
  execute: async ({ city }: { city: string }) => {
    const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
    // fake wait for weather data
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return weatherOptions[
      Math.floor(Math.random() * weatherOptions.length)
    ];
  },
});