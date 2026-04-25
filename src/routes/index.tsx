import { createAsync, useAction } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { getPosts, createPost, deletePost } from "~/lib/posts";
import { toggleLike } from "~/lib/likes";
import { getCurrentUser, logout } from "~/lib/auth";

export default function Home() {
  const posts = createAsync(() => getPosts());
  const currentUser = createAsync(() => getCurrentUser());
  const createPostAction = useAction(createPost);
  const deletePostAction = useAction(deletePost);
  const toggleLikeAction = useAction(toggleLike);
  const logoutAction = useAction(logout);

  let contentInput!: HTMLTextAreaElement;

  const handleCreatePost = async () => {
    const content = contentInput.value.trim();
    if (!content) return;
    await createPostAction(content);
    contentInput.value = "";
  };

  return (
    <div>
      <Suspense>
        <Show when={currentUser()} fallback={<a href="/login">ログイン</a>}>
          <div>
            <span>{currentUser()?.name}</span>
            <button onClick={() => logoutAction()}>ログアウト</button>
          </div>
        </Show>
      </Suspense>

      <Suspense>
        <Show when={currentUser()}>
          <div>
            <textarea ref={contentInput} placeholder="いまなにしてる？" />
            <button onClick={handleCreatePost}>投稿</button>
          </div>
        </Show>
      </Suspense>

      <Suspense fallback={<p>Loading...</p>}>
        <For each={posts()}>
          {(post) => (
            <div>
              <p>{post.userName}</p>
              <p>{post.content}</p>
              <button onClick={() => toggleLikeAction(post.id)}>いいね</button>
              <Show when={currentUser()?.id === post.userId}>
                <button onClick={() => deletePostAction(post.id)}>削除</button>
              </Show>
            </div>
          )}
        </For>
      </Suspense>
    </div>
  );
}
