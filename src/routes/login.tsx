import { createAsync, useAction } from "@solidjs/router";
import { For, Suspense } from "solid-js";
import { getUsers, createUser } from "~/lib/users";
import { login } from "~/lib/auth";

export default function Login() {
  const users = createAsync(() => getUsers());
  const loginAction = useAction(login);
  const createUserAction = useAction(createUser);

  let nameInput!: HTMLInputElement;

  const handleCreateUser = async () => {
    const name = nameInput.value.trim();
    if (!name) return;
    await createUserAction(name);
    nameInput.value = "";
  };

  return (
    <div>
      <h1>ログイン</h1>

      <div>
        <input ref={nameInput} type="text" placeholder="ユーザー名" />
        <button onClick={handleCreateUser}>新規作成</button>
      </div>

      <Suspense fallback={<p>Loading...</p>}>
        <ul>
          <For each={users()}>
            {(user) => (
              <li>
                <button onClick={() => loginAction(user.id)}>
                  {user.name}
                </button>
              </li>
            )}
          </For>
        </ul>
      </Suspense>
    </div>
  );
}
