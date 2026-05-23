# Cursor Prompt: «Поруч» — карта ресурсів для українців у Чехії

> Скопіюй цей промт повністю в Cursor як перше повідомлення нового проєкту.
> Або розбий на секції і виконуй покроково.

---

## 🧭 Контекст продукту

Ти будуєш **«Поруч»** (`poruch.cz`) — інтерактивну карту ресурсів для українців у Чехії.

Продукт допомагає знайти перевірені місця та сервіси: медицину, юридичну допомогу, курси чеської мови, роботу, житло, українські магазини, кафе та спільноту. Аудиторія — 393 000+ українців у Чехії, які щодня стикаються з інформаційним хаосом при адаптації.

**Слоган:** «Твій путівник у новому місті»
**Мова інтерфейсу:** українська (основна), чеська (перемикач у шапці)
**MVP-місто:** Прага. Потім — Брно, Острава, Пльзень.

---

## ⚙️ Технічний стек

```
Frontend:    Next.js 14 (App Router) + TypeScript
UI:          shadcn/ui + Tailwind CSS
Карта:       Mapbox GL JS (через react-map-gl)
База даних:  Supabase (PostgreSQL + RLS + Storage)
Авторизація: Supabase Auth (email + Google OAuth)
Деплой:      Vercel
Email:       Resend
Аналітика:   Vercel Analytics
```

---

## 🗄️ Схема бази даних Supabase

### `places`
```sql
create table places (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),

  name          text not null,
  description   text,
  category      text not null,
  subcategory   text,
  city          text not null default 'Praha',

  address       text,
  phone         text,
  website       text,
  email         text,

  lat           float8,
  lng           float8,

  languages     text[],
  hours         jsonb,
  tags          text[],
  photos        text[],

  is_verified   boolean default false,
  is_active     boolean default true,
  is_free       boolean default false,

  views_count   int default 0,
  saves_count   int default 0,

  google_maps_url text,
  facebook_url    text,
  instagram_url   text,

  submitted_by  uuid references auth.users(id),
  approved_by   uuid references auth.users(id),
  approved_at   timestamptz
);

create index on places(category);
create index on places(city);
create index on places(is_active, is_verified);
create extension if not exists postgis;
alter table places add column location geometry(Point, 4326);
create index on places using gist(location);
```

### `reviews`
```sql
create table reviews (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  place_id   uuid references places(id) on delete cascade,
  user_id    uuid references auth.users(id),
  rating     int check (rating between 1 and 5),
  text       text,
  is_visible boolean default true
);
```

### `saves`
```sql
create table saves (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id    uuid references auth.users(id),
  place_id   uuid references places(id) on delete cascade,
  unique(user_id, place_id)
);
```

### `suggestions`
```sql
create table suggestions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  name          text not null,
  category      text not null,
  address       text,
  phone         text,
  website       text,
  description   text,
  contact_email text,
  status        text default 'pending'
);
```

### `profiles`
```sql
create table profiles (
  id           uuid primary key references auth.users(id),
  created_at   timestamptz default now(),
  display_name text,
  avatar_url   text,
  city         text default 'Praha',
  is_admin     boolean default false
);
```

### RLS
```sql
alter table places enable row level security;
create policy "places_select" on places for select using (is_active = true);
create policy "places_insert" on places for insert with check (
  exists(select 1 from profiles where id = auth.uid() and is_admin = true)
);

alter table reviews enable row level security;
create policy "reviews_select" on reviews for select using (is_visible = true);
create policy "reviews_insert" on reviews for insert with check (auth.uid() = user_id);

alter table saves enable row level security;
create policy "saves_all" on saves using (auth.uid() = user_id);
```

---

## 📁 Структура файлів

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                   # Редирект на /map
│   ├── map/page.tsx               # Головна — карта + панель деталей
│   ├── list/page.tsx              # Список карток
│   ├── place/[id]/page.tsx        # Сторінка місця (SEO)
│   ├── saved/page.tsx             # Збережені (auth required)
│   ├── suggest/page.tsx           # Форма пропозиції
│   ├── admin/page.tsx             # Адмін панель
│   └── api/
│       ├── places/route.ts
│       ├── places/[id]/route.ts
│       ├── reviews/route.ts
│       ├── saves/route.ts
│       └── suggestions/route.ts
│
├── components/
│   ├── map/
│   │   ├── MapView.tsx
│   │   ├── MapPin.tsx
│   │   └── MapControls.tsx
│   ├── place/
│   │   ├── PlaceCard.tsx
│   │   ├── PlaceDetail.tsx
│   │   ├── PlaceContacts.tsx
│   │   ├── PlaceTags.tsx
│   │   ├── PlaceActions.tsx
│   │   └── PlaceReviews.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── ViewToggle.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── types.ts
│   ├── categories.ts
│   └── utils.ts
│
└── hooks/
    ├── usePlaces.ts
    ├── useMapbox.ts
    └── useSaves.ts
```

---

## 📋 Категорії

```typescript
// src/lib/categories.ts
export const CATEGORIES = [
  { id: 'all',       label: 'Всі',                icon: '📍', color: '#C1440E' },
  { id: 'medicine',  label: 'Медицина',            icon: '🏥', color: '#E53E3E' },
  { id: 'legal',     label: 'Правова допомога',    icon: '⚖️', color: '#744210' },
  { id: 'language',  label: 'Освіта та мова',      icon: '🎓', color: '#2B6CB0' },
  { id: 'work',      label: 'Робота',              icon: '💼', color: '#276749' },
  { id: 'housing',   label: 'Житло',               icon: '🏠', color: '#553C9A' },
  { id: 'shops',     label: 'Магазини та послуги', icon: '🛍️', color: '#C05621' },
  { id: 'cafe',      label: 'Кафе та ресторани',   icon: '☕', color: '#7B341E' },
  { id: 'community', label: 'Спільнота',            icon: '🤝', color: '#285E61' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
```

---

## 🎨 Дизайн-система (точно як LifeMap)

```typescript
// tailwind.config.ts
colors: {
  brand: {
    50:  '#FDF0EB',
    100: '#F9D4C3',
    500: '#C1440E',   // основний — оранжево-коричневий
    600: '#A33A0B',
    700: '#852F09',
  },
  neutral: {
    50:  '#FAF9F7',   // фон сторінки (теплий білий)
    100: '#F2EFE9',
    200: '#E5E0D8',
    800: '#2D2926',
  }
}
```

**Verified бейдж:** `bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full font-medium`
**Кнопка дзвінка:** `bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-4 py-2`
**Кнопка маршруту:** `border border-neutral-200 hover:bg-neutral-100 rounded-lg px-4 py-2`
**Активна категорія:** `bg-brand-500 text-white rounded-full px-3 py-1.5`
**Неактивна категорія:** `bg-white border border-neutral-200 text-neutral-800 rounded-full px-3 py-1.5`
**Теги:** `bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-md`
**Зірки рейтингу:** `text-amber-400`
**Фон сторінки:** `bg-neutral-50`

---

## 🖥️ Компонент PlaceDetail.tsx (права панель)

Точно відтворює скріншот LifeMap:

```tsx
// Структура компонента:
<div className="w-full h-full bg-white border-l border-neutral-200 overflow-y-auto">

  {/* Порожній стан */}
  {!place && (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-400">
      <MapPinIcon size={40} strokeWidth={1} />
      <p className="text-sm">Натисни на маркер на карті, щоб побачити деталі</p>
    </div>
  )}

  {/* Заповнений стан */}
  {place && (
    <div className="p-5 space-y-4">

      {/* Шапка */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-semibold text-lg text-neutral-800">{place.name}</h2>
            {place.is_verified && (
              <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>
          {/* Рейтинг */}
          <div className="flex items-center gap-1 text-sm">
            <StarIcon className="text-amber-400" size={14} fill="currentColor" />
            <span className="font-medium">{avgRating}</span>
            <span className="text-neutral-400">({reviewCount} відгуків)</span>
          </div>
        </div>
        <BookmarkButton placeId={place.id} />
      </div>

      {/* Опис */}
      <p className="text-sm text-neutral-600 leading-relaxed">{place.description}</p>

      {/* Контакти */}
      <div className="space-y-2">
        {place.address && (
          <div className="flex items-start gap-2 text-sm text-neutral-600">
            <MapPinIcon size={15} className="text-brand-500 mt-0.5 flex-shrink-0" />
            <span>{place.address}</span>
          </div>
        )}
        {place.phone && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <PhoneIcon size={15} className="text-brand-500 flex-shrink-0" />
            <a href={`tel:${place.phone}`} className="hover:text-brand-500">{place.phone}</a>
          </div>
        )}
        {place.hours && (
          <div className="flex items-start gap-2 text-sm text-neutral-600">
            <ClockIcon size={15} className="text-brand-500 mt-0.5 flex-shrink-0" />
            <span>{formatHours(place.hours)}</span>
          </div>
        )}
        {place.languages && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <GlobeIcon size={15} className="text-brand-500 flex-shrink-0" />
            <span>{place.languages.map(langLabel).join(', ')}</span>
          </div>
        )}
      </div>

      {/* Теги */}
      <div className="flex flex-wrap gap-1.5">
        {place.tags?.map(tag => (
          <span key={tag} className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      {/* Кнопки дій */}
      <div className="flex gap-2 pt-1">
        <a href={`tel:${place.phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
          <PhoneIcon size={15} />
          Зателефонувати
        </a>
        <a href={place.google_maps_url || `https://maps.google.com/?q=${place.lat},${place.lng}`}
          target="_blank"
          className="flex-1 flex items-center justify-center gap-2 border border-neutral-200 hover:bg-neutral-100 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
          <NavigationIcon size={15} />
          Маршрут
        </a>
      </div>

    </div>
  )}

  {/* Підвал з лічильником */}
  {place && (
    <div className="px-5 py-3 border-t border-neutral-100 text-xs text-neutral-400">
      Знайдено <strong className="text-neutral-600">{totalCount}</strong> місць
      {activeCategory !== 'all' && ` в категорії "${categoryLabel}"`}
    </div>
  )}
</div>
```

---

## 🗺️ MapView.tsx — налаштування Mapbox

```typescript
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const PRAGUE_CENTER = { longitude: 14.4378, latitude: 50.0755 };

export function MapView({ places, onSelectPlace, selectedId }) {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{ ...PRAGUE_CENTER, zoom: 12 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/light-v11"
    >
      <NavigationControl position="top-right" />

      {places.map(place => (
        <Marker
          key={place.id}
          longitude={place.lng}
          latitude={place.lat}
          anchor="bottom"
          onClick={() => onSelectPlace(place)}
        >
          <MapPin
            category={place.category}
            isSelected={place.id === selectedId}
          />
        </Marker>
      ))}
    </Map>
  );
}

// MapPin — коло з іконкою категорії, збільшується при виборі
function MapPin({ category, isSelected }) {
  const cat = CATEGORIES.find(c => c.id === category);
  return (
    <div className={cn(
      "flex items-center justify-center rounded-full border-2 border-white shadow-md cursor-pointer transition-transform",
      isSelected ? "w-10 h-10 scale-110" : "w-8 h-8",
    )}
    style={{ backgroundColor: cat?.color || '#C1440E' }}>
      <span className="text-sm">{cat?.icon}</span>
    </div>
  );
}
```

---

## 🔍 API пошуку

```typescript
// GET /api/places?category=medicine&city=Praha&q=лікар
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const city     = searchParams.get('city') || 'Praha';
  const q        = searchParams.get('q');

  let query = supabase
    .from('places')
    .select(`*, reviews(rating)`)
    .eq('is_active', true)
    .eq('city', city);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data } = await query.limit(200);
  return Response.json(data);
}
```

---

## 🌱 Seed-дані (Прага, 20 місць)

```sql
insert into places (name, category, address, lat, lng, description, languages, tags, is_verified, is_free, phone, website) values
('Посольство України в Чехії',          'legal',     'Charlese de Gaulle 29, Praha 6', 50.0734, 14.3886, 'Консульські послуги, оформлення документів', '{uk,cs}',    '{документи,консульство,посольство}',     true, true,  '+420 233 342 000', 'https://czechia.mfa.gov.ua'),
('Centrum pro integraci cizinců',        'legal',     'Jeremenkova 5, Praha 4',         50.0601, 14.4280, 'Безкоштовна юридична та соціальна допомога', '{uk,cs,en}', '{інтеграція,юридична,безкоштовно}',      true, true,  '+420 296 325 345', 'https://cicpraha.org'),
('Nová Škola — курси чеської',           'language',  'Ostrovského 253, Praha 5',       50.0706, 14.3960, 'Курси чеської мови для українців А1-В2',     '{uk,cs}',    '{чеська,курси,сертифікат,А1,В1,В2}',    true, false, '+420 257 942 320', 'https://novaskola.org'),
('Педіатр Bc. Олена Шевченко',           'medicine',  'Vinohrady, Praha 2',             50.0750, 14.4480, 'Україномовний педіатр, прийом дітей',       '{uk,cs}',    '{педіатр,діти,uk-мовний}',               true, false, '+420 777 123 456', null),
('Психологічна підтримка — Centrum Krizové Intervence', 'medicine', 'Ústavní 91, Praha 8', 50.1186, 14.4638, 'Безкоштовна психологічна допомога', '{uk,cs,en}', '{психолог,криза,безкоштовно}',           true, true,  '+420 284 016 666', null),
('Jobs for Ukraine — Praha',             'work',      'Wenceslas Square 1, Praha 1',    50.0796, 14.4275, 'Ярмарки вакансій, безкоштовне консультування', '{uk,cs,en}','{робота,вакансії,ярмарок}',             true, true,  null,               'https://jobsforukraine.net'),
('Украинская продуктовая лавка "Рідне"', 'shops',     'Žižkov, Praha 3',                50.0833, 14.4521, 'Продукти, косметика, книги з України',       '{uk}',       '{продукти,крамниця,рідне}',              true, false, '+420 608 987 654', null),
('Кафе "Lviv Croissants" Praha',         'cafe',      'Senovážné náměstí 3, Praha 1',   50.0840, 14.4320, 'Українська кав'ярня, вареники, борщ',        '{uk,cs}',    '{кава,вареники,борщ,українське}',        true, false, null,               null),
('Помічник UA — допомога з документами', 'legal',     'Online / Praha',                 50.0755, 14.4378, 'Допомога з ВПО статусом, OSVČ, оформленням', '{uk}',       '{документи,OSVČ,ВПО,онлайн}',            true, false, '+420 736 111 222', null),
('Українська недільна школа Praha',      'community', 'Vinohrady, Praha 2',             50.0760, 14.4460, 'Українська мова та культура для дітей',       '{uk}',       '{діти,школа,українська-мова,culture}',   true, true,  null,               null)
;
```

---

## 📱 Мобільна версія

На екранах < 768px:
- Карта на весь екран
- При кліку на пін — bottom sheet виїжджає знизу (висота 65vh)
- Bottom sheet: `fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl`
- Анімація: `transition-transform duration-300 translate-y-full → translate-y-0`
- Категорії — горизонтальний скролл без видимих стрілок

---

## ✅ Порядок запуску

```bash
npx create-next-app@latest poruch --typescript --tailwind --app --src-dir
cd poruch
npx shadcn@latest init
npm install @supabase/ssr @supabase/supabase-js mapbox-gl react-map-gl resend lucide-react
```

```bash
# .env.local
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
```

**Порядок компонентів:**
1. `CategoryFilter.tsx` — фільтри категорій
2. `SearchBar.tsx` — пошуковий рядок
3. `MapView.tsx` — карта з пінами
4. `PlaceDetail.tsx` — права панель деталей
5. `PlaceCard.tsx` — картка для списку
6. `/api/places` — ендпоінт пошуку
7. `suggest/page.tsx` — форма пропозиції
8. `admin/page.tsx` — модерація

---

## 🚀 Перший промт в Cursor (вставляй одразу)

```
Я будую "Поруч" (poruch.cz) — Next.js 14 + TypeScript + Supabase додаток.
Це інтерактивна карта ресурсів для українців у Чехії.

Стек: Next.js 14 App Router, shadcn/ui, Tailwind CSS,
react-map-gl (Mapbox), Supabase (auth + db + storage), Resend, Vercel.

Дизайн: основний колір #C1440E, фон #FAF9F7.
Мова інтерфейсу: українська.

Створи базову структуру проєкту:
1. src/lib/supabase/client.ts і server.ts (createBrowserClient / createServerClient)
2. src/lib/types.ts — тип Place з усіма полями (id, name, category, address,
   lat, lng, phone, website, hours, languages, tags, photos,
   is_verified, is_active, is_free, views_count, saves_count)
3. src/lib/categories.ts — масив CATEGORIES з полями id, label, icon, color
   (медицина, право, мова, робота, житло, магазини, кафе, спільнота)
4. src/components/search/CategoryFilter.tsx — горизонтальний скролл кнопок категорій.
   Props: categories, activeCategory, onSelect, counts (Record<string, number>).
   Активна = bg-[#C1440E] text-white rounded-full.
   Неактивна = bg-white border border-neutral-200 rounded-full.
   Показуй count поруч з назвою.

Детальна схема БД, структура проєкту і всі компоненти — в poruch_cursor_prompt.md.
```

---

*Поруч — щоб ти не був один у новому місті.*
