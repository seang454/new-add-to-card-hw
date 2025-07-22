
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const productsApi = createApi({
    reducerPath: "productsApi",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API }),
    tagTypes: ["Product"],
    endpoints: () => ({
    })
})
