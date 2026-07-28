import { useParams } from 'react-router-dom'

export function PublicUserPage() {
  const { id = '' } = useParams()

  return (
    <div className="mx-auto max-w-5xl space-y-8 font-sans text-slate-800">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
        <p className="mt-1 text-sm text-slate-500">User ID: {id}</p>
      </section>
    </div>
  )
}

export default PublicUserPage
