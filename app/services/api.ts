/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 */
import axios from "axios"

import { config as customConfig } from "../../config"

/**
 * Configuring the apisauce instance.
 */
export interface ApiConfig {
  url: string
  timeout: number
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: customConfig.baseURL,
  timeout: 10000,
}

export const generateApiClient = () => {
  const config: ApiConfig = DEFAULT_API_CONFIG
  const api = axios.create({
    baseURL: config.url,
    timeout: config.timeout,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Add request transform here like adding tokens to headers
  api.interceptors.request.use(
    con => {
      const token = customConfig.Token
      if (token) {
        con.headers.Authorization = `Bearer ${token}`
      }
      return con
    },
    error => {
      return Promise.reject(error)
    },
  )

  return api
}

export const api = generateApiClient()
