export default function SettingsPage() {
    return (
      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-main)]">
          Settings
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-soft)]">
          Configure admin preferences and dashboard behavior.
        </p>
      </section>
    );
  }