import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000/';

export const articleApi = createApi({
    reducerPath: 'articleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: serverUrl,
    }),
    endpoints: (builder) => ({
        getSummary: builder.query({
            query: (params) => `summarize?url=${encodeURIComponent(params.articleUrl)}`,
        }),
    }),
})

export const { useLazyGetSummaryQuery } = articleApi