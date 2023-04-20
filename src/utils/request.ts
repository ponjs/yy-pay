import qs from 'qs'

interface RequestConfig {
  url: string
  method?: string
  data?: Record<string, any>
  headers?: HeadersInit
}

const baseURL = 'https://pay.yy.com'

const combineURL = (baseURL = '', relativeURL = '') => {
  if (/^https?:\/\//.test(relativeURL)) return relativeURL
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

const request = (config: RequestConfig) => {
  const url = combineURL(baseURL, config.url)

  return fetch(url, {
    body: config.data ? qs.stringify(config.data) : undefined,
    method: config.method || 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Referer: url,
      ...config.headers,
    },
  })
}

export default request
