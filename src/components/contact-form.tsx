import type { ContactInfo } from "@/types/content";

export function ContactForm({ contactInfo }: { contactInfo: ContactInfo }) {
  return (
    <form
      className="grid gap-3"
      action={`mailto:${contactInfo.formRecipient}`}
      method="post"
      encType="text/plain"
      aria-label="Contactformulier"
    >
      <label className="grid gap-1 text-sm font-medium" htmlFor="name">
        Naam
        <input
          id="name"
          name="Naam"
          required
          className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium" htmlFor="email">
        E-mail
        <input
          id="email"
          type="email"
          name="E-mail"
          required
          className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium" htmlFor="message">
        Bericht
        <textarea
          id="message"
          name="Bericht"
          required
          rows={5}
          placeholder="Bijv. 14 juni, Utrecht, live optreden of studio-opname"
          className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        />
      </label>
      <button
        type="submit"
        className="inline-flex w-fit items-center justify-center rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        Verstuur formulier
      </button>
    </form>
  );
}
