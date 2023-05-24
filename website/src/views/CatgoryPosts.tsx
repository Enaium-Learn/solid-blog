import { createImmerSignal } from "solid-immer"
import { RequestOf } from "../__generated"
import { createQuery } from "@tanstack/solid-query"
import { api } from "../common/ApiInstance"
import { Link, useParams } from "@solidjs/router"
import { Switch, Match, For } from "solid-js"

const CategoryPosts = () => {
  const params = useParams()

  const [options, setOptions] = createImmerSignal<RequestOf<typeof api.postController.findPostsByCategory>>({
    categoryId: params.categoryId
  })

  const posts = createQuery({
    queryKey: () => ["posts", options()],
    queryFn: () => api.postController.findPostsByCategory(options())
  })

  return (
    <Switch>
      <Match when={posts.isLoading}>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </Match>
      <Match when={posts.isError}>Error</Match>
      <Match when={posts.isSuccess}>
        <ul class="list-group">
          <For each={posts.data.content}>
            {(post) => (
              <li class="list-group-item">
                <Link href={`/post/${post.id}`}>{post.title}</Link>
              </li>
            )}
          </For>
        </ul>
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item">
              <div
                class="page-link"
                onClick={() => {
                  if (options().page ?? 0 > 0)
                    setOptions((draft) => {
                      draft.page = (options().page ?? 0) - 1
                    })
                }}
              >
                Previous
              </div>
            </li>
            <For each={Array.from({ length: posts.data.totalPages }, (_, i) => i + 1)}>
              {(page, index) => (
                <li class="page-item">
                  <div
                    class="page-link"
                    classList={{ active: (options().page ?? 0) === index() }}
                    onClick={() =>
                      setOptions((draft) => {
                        draft.page = index()
                      })
                    }
                  >
                    {page}
                  </div>
                </li>
              )}
            </For>
            <li class="page-item">
              <div
                class="page-link"
                onClick={() => {
                  if ((options().page ?? 0) < posts.data.totalPages - 1)
                    setOptions((draft) => {
                      draft.page = (options().page ?? 0) + 1
                    })
                }}
              >
                Next
              </div>
            </li>
          </ul>
        </nav>
      </Match>
    </Switch>
  )
}

export default CategoryPosts
