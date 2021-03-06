import { withDefaultOpts } from './fetch'

export type RestfulResource = {
  findAll: (filters?: URLSearchParams) => Promise<unknown>
  findById: (id: string, filters?: URLSearchParams) => Promise<unknown>
  create: (obj: string) => Promise<unknown>
  update: (id: string, obj?: unknown) => Promise<unknown>
  del: (id: string) => Promise<unknown>
  raw: (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    options?: { body?: unknown; filters?: URLSearchParams },
  ) => Promise<unknown>
}

export function RestfulResource(endpoint: string): RestfulResource {
  function getPath(
    basePath: string | undefined,
    params: URLSearchParams | undefined,
  ) {
    basePath = basePath !== undefined ? `/${basePath}` : ''
    const filters = params !== undefined ? `?${params.toString()}` : ''
    return `${endpoint}${basePath}${filters}`
  }

  function handleResponse(res: Response): Promise<unknown> {
    if (!res.ok) {
      if (res.status === 401) {
        location.href = '/login'
      }

      return Promise.reject({
        message: `REST Error: ${res.url} returned HTTP ${res.status} (${res.statusText})`,
        status: res.status,
      })
    }

    return res.json()
  }

  function findAll(filters?: URLSearchParams): Promise<unknown> {
    return raw('GET', '', { filters })
  }

  function findById(id: string, filters?: URLSearchParams): Promise<unknown> {
    return raw('GET', id, { filters })
  }

  function create(obj: string): Promise<unknown> {
    return raw('POST', '', { body: obj })
  }

  function update(id: string, obj?: unknown): Promise<unknown> {
    return raw('PUT', id, { body: obj })
  }

  function del(id: string): Promise<unknown> {
    return raw('DELETE', id)
  }

  function raw(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    { body, filters }: { body?: unknown; filters?: URLSearchParams } = {},
  ): Promise<unknown> {
    return fetch(
      getPath(path, filters),
      withDefaultOpts({
        method,
        body: JSON.stringify(body),
        headers:
          body !== undefined ? { 'Content-Type': 'application/json' } : {},
      }),
    ).then(handleResponse)
  }

  return {
    findAll,
    findById,
    create,
    update,
    del,
    raw,
  }
}
