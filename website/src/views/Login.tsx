import { createImmerSignal } from "solid-immer"
import { useSessionStore } from "../store"
import { UserInput } from "../__generated/model/static"
import { api } from "../common/ApiInstance"
import toast from "solid-toast"
import { Link, Route, useNavigate } from "@solidjs/router"

const Login = () => {
  const navigate = useNavigate()

  const session = useSessionStore()

  let formRef

  const [form, setForm] = createImmerSignal<UserInput>({})

  const submit = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (formRef.checkValidity()) {
      api.sessionController
        .login({ body: form() })
        .then((data) => {
          session.setToken(data.token)
          session.setId(data.id)
          toast.success("Login success")
          navigate("/")
        })
        .catch((err) => {
          toast.error(err)
        })
    }

    formRef.classList.add("was-validated")
  }

  return (
    <div class="vh-100 d-flex justify-content-center align-items-center">
      <div class="card p-5">
        <form ref={formRef} class="needs-validation" style={{ width: "18rem", height: "14rem" }} novalidate>
          <div class="d-flex flex-column justify-content-between h-100">
            <div>
              <label class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                value={form().username ?? ""}
                required
                onInput={(e) => setForm((draft) => (draft.username = e.currentTarget.value))}
              />
              <div class="valid-feedback">Looks good!</div>
              <div class="invalid-feedback">Please enter your username.</div>
            </div>
            <div>
              <label class="form-label">Password</label>
              <input
                type="text"
                class="form-control"
                required
                value={form().password ?? ""}
                onInput={(e) => setForm((draft) => (draft.password = e.currentTarget.value))}
              />
              <div class="valid-feedback">Looks good!</div>
              <div class="invalid-feedback">Please enter your password.</div>
            </div>
            <Link href="/register">Register</Link>
            <button class="btn btn-primary" type="submit" onClick={submit}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
