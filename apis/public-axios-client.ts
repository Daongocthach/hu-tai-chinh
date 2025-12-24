import { showAlertWithCustomText } from '@/alerts'
import { URL_FINEPRO } from '@/lib'
import useStore from '@/store'
import axios, { AxiosError } from 'axios'

const publicAxios = axios.create()

publicAxios.interceptors.request.use(
  (config) => {
    const { url } = useStore.getState()
    config.baseURL = url ?? URL_FINEPRO + '/api/v1/'
    config.headers.Accept = 'application/json'
    return config
  },
  (error) => Promise.reject(error)
)


publicAxios.interceptors.response.use(
  (response) => response.data,

  (error: AxiosError<any>) => {
    if (!error.response) {
      showAlertWithCustomText(
        'network error',
        'please check your internet connection',
        'error'
      )
      return Promise.reject(error)
    }

    const { data } = error.response
    const message =
      data?.message ||
      error.message ||
      'something went wrong'

    showAlertWithCustomText(
      'error',
      message,
      'error'
    )

    return Promise.reject(error)
  }
)


export default publicAxios
