import { SiteHeader } from "@/components/layout/SiteHeader";
import { CATEGORIES } from "@/lib/categories";

export default function SuggestPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F7] text-neutral-900">
      <SiteHeader active="suggest" />
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-950">Додати місце</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            Запропонуй ресурс для українців у Чехії. Зараз форма мокова, далі вона піде в таблицю suggestions.
          </p>

          <form className="mt-6 space-y-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <Field label="Назва місця" placeholder="Наприклад, курси чеської для українців" />
            <label className="block">
              <span className="text-sm font-medium text-neutral-800">Категорія</span>
              <select className="mt-2 h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-[#C1440E]">
                {CATEGORIES.filter((category) => category.id !== "all").map((category) => (
                  <option key={category.id}>{category.label}</option>
                ))}
              </select>
            </label>
            <Field label="Адреса" placeholder="Місто, район, вулиця" />
            <Field label="Телефон або сайт" placeholder="+420 ... або https://..." />
            <label className="block">
              <span className="text-sm font-medium text-neutral-800">Короткий опис</span>
              <textarea
                placeholder="Що це за місце і чим воно корисне?"
                className="mt-2 min-h-28 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#C1440E]"
              />
            </label>
            <Field label="Твій email для уточнень" placeholder="name@example.com" />
            <button
              type="button"
              className="h-11 rounded-lg bg-[#C1440E] px-5 text-sm font-medium text-white hover:bg-[#A33A0B]"
            >
              Надіслати на модерацію
            </button>
          </form>
        </div>

        <aside className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-neutral-950">Що буде далі</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-600">
            <p>1. Місце потрапить у чергу модерації.</p>
            <p>2. Адмін перевірить контакти, адресу й актуальність.</p>
            <p>3. Після підтвердження місце зʼявиться на карті.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-[#C1440E]"
      />
    </label>
  );
}
